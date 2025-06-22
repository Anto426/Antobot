import BotConsole from "../../class/console/BotConsole.js";
import SqlManager from "../../class/Sql/SqlManager.js";
import ConfigManager from "../../class/ConfigManager/ConfigManager.js";
import PresetEmbed from "../../class/embed/PresetEmbed.js";

const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000; // 5 minuti

export default class Holiday {
  #holidays = [];
  #trackedGuilds = new Map();
  #heartbeatTimer = null;
  #isInitialized = false;

  constructor() {}

  init() {
    if (this.#isInitialized) return;
    this.#isInitialized = true;

    try {
      const holidayList = ConfigManager.getConfig("hollyday")?.holidays;
      if (
        !holidayList ||
        !Array.isArray(holidayList) ||
        holidayList.length === 0
      ) {
        throw new Error(
          "Dati festività mancanti o non validi da ConfigManager."
        );
      }

      this.#holidays = holidayList
        .map((h) => ({
          ...h,
          date: {
            month: parseInt(h.date.month, 10),
            day: parseInt(h.date.day, 10),
          },
        }))
        .filter((h) => !isNaN(h.date.month) && !isNaN(h.date.day));

      if (this.#holidays.length === 0) {
        throw new Error("Nessuna festività valida trovata dopo il parsing.");
      }
      BotConsole.success(
        `[Holiday] Caricate ${this.#holidays.length} definizioni di festività.`
      );

      this.run();
    } catch (error) {
      BotConsole.error("[Holiday] Fallita inizializzazione.", error);
      this.#isInitialized = false;
    }
  }

  /**
   * Avvia il processo di tracking per tutte le gilde e l'heartbeat.
   */
  async run() {
    if (!this.#isInitialized) {
      BotConsole.error(
        "[Holiday] Sistema non inizializzato. Chiamare init() prima di run()."
      );
      return;
    }
    BotConsole.info(
      "[Holiday] Avvio processo tracking festività per tutte le gilde..."
    );
    for (const guild of client.guilds.cache.values()) {
      await this.processGuild(guild);
    }
    this.#startHeartbeat();
  }

  /**
   * Processa una gilda per avviare o fermare il tracking.
   */
  async processGuild(guild) {
    const logPrefix = `[Holiday - ${guild.name}]`;
    this.stopGuildTracking(guild.id);

    try {
      const { channels, error } = await this.#getAndValidateGuildConfig(guild);
      if (error) {
        BotConsole.info(`${logPrefix} Setup non valido: ${error}.`);
        return;
      }

      const nextHoliday = this.#findNextHoliday();
      if (nextHoliday) {
        BotConsole.info(
          `${logPrefix} Prossima festività: ${nextHoliday.name}. Avvio tracking.`
        );
        this.#trackedGuilds.set(guild.id, {
          guild,
          channels,
          holiday: nextHoliday,
        });
        await this.#updateGuildChannels(this.#trackedGuilds.get(guild.id));
      } else {
        BotConsole.warning(`${logPrefix} Nessuna festività futura trovata.`);
        await this.#resetChannelNames(channels, logPrefix);
      }
    } catch (e) {
      BotConsole.error(`${logPrefix} Errore durante il processo.`, e);
    }
  }

  /**
   * Interrompe il tracking e resetta i canali per una gilda specifica.
   */
  async stopGuildTracking(guildId) {
    if (this.#trackedGuilds.has(guildId)) {
      const { channels } = this.#trackedGuilds.get(guildId);
      await this.#resetChannelNames(channels, `[Holiday - ${guildId}]`);
      this.#trackedGuilds.delete(guildId);
      BotConsole.info(
        `[Holiday] Tracking festività interrotto per gilda ${guildId}.`
      );
    }
  }

  #startHeartbeat() {
    if (this.#heartbeatTimer) clearInterval(this.#heartbeatTimer);
    this.#heartbeatTimer = setInterval(
      () => this.#heartbeat(),
      HEARTBEAT_INTERVAL_MS
    );
    BotConsole.info(
      `[Holiday] Heartbeat avviato (controllo ogni ${
        HEARTBEAT_INTERVAL_MS / 1000
      }s).`
    );
  }

  async #heartbeat() {
    if (this.#trackedGuilds.size === 0) return;
    BotConsole.debug(
      `[Holiday] Heartbeat: controllo ${this.#trackedGuilds.size} gilde...`
    );

    for (const trackingInfo of this.#trackedGuilds.values()) {
      if (Date.now() >= trackingInfo.holiday.timestamp) {
        await this.#handleHolidayArrival(trackingInfo);
      } else {
        await this.#updateGuildChannels(trackingInfo);
      }
    }
  }

  async #updateGuildChannels(trackingInfo) {
    const { channels, holiday, guild } = trackingInfo;
    const holidayName = `${holiday.emoji || "🎉"} ${holiday.name}`;
    const timeRemaining = this.#formatTimeRemaining(holiday.timestamp);

    try {
      if (channels.nameChannel.name !== holidayName) {
        await channels.nameChannel.setName(holidayName.slice(0, 100));
      }
      if (channels.timerChannel.name !== timeRemaining) {
        await channels.timerChannel.setName(timeRemaining.slice(0, 100));
      }
    } catch (error) {
      BotConsole.error(
        `[Holiday - ${guild.name}] Errore aggiornando i nomi dei canali.`,
        error.message
      );
    }
  }

  async #handleHolidayArrival(trackingInfo) {
    const { guild } = trackingInfo;
    BotConsole.success(
      `[Holiday - ${guild.name}] Festività ${trackingInfo.holiday.name} è ARRIVATA!`
    );

    await this.#sendCongratulations(trackingInfo);

    await this.processGuild(guild);
  }

  async #getAndValidateGuildConfig(guild) {
    const guildConfigDb = await SqlManager.getGuildById(guild.id);
    if (!guildConfigDb?.HOLYDAY_ID)
      return { error: "HOLYDAY_ID non configurato." };

    const holydaySetup = await SqlManager.getHollydayById(
      guildConfigDb.HOLYDAY_ID
    );
    if (!holydaySetup)
      return {
        error: `Record HOLYDAY ${guildConfigDb.HOLYDAY_ID} non trovato.`,
      };

    const nameChannel = await guild.channels
      .fetch(holydaySetup.NAME_CHANNEL)
      .catch(() => null);
    const timerChannel = await guild.channels
      .fetch(holydaySetup.HOLYDAY_CHANNEL)
      .catch(() => null);

    if (!nameChannel || !timerChannel) {
      return { error: "Uno o entrambi i canali (nome, timer) non trovati." };
    }

    const congratsChannel = nameChannel.isTextBased() ? nameChannel : null;
    if (!congratsChannel) {
      return {
        error:
          "Il canale del nome deve essere un canale di testo per inviare gli auguri.",
      };
    }

    return { channels: { nameChannel, timerChannel, congratsChannel } };
  }

  async #resetChannelNames(channels, logPrefix) {
    try {
      if (channels.nameChannel && channels.nameChannel.name !== "🎉 Eventi") {
        await channels.nameChannel.setName("🎉 Eventi");
      }
      if (
        channels.timerChannel &&
        channels.timerChannel.name !== "⏳ Countdown"
      ) {
        await channels.timerChannel.setName("⏳ Countdown");
      }
    } catch (e) {
      BotConsole.warning(`${logPrefix} Fallito reset nomi canali.`, e.message);
    }
  }

  #findNextHoliday() {
    if (!this.#isInitialized) return null;

    const now = Date.now();
    let nextHoliday = null;
    let nextHolidayTimestamp = Infinity;
    let yearToSearch = new Date().getFullYear();

    for (let i = 0; i < 2; i++) {
      const currentYear = yearToSearch + i;
      for (const holiday of this.#holidays) {
        const holidayDate = new Date(
          currentYear,
          holiday.date.month - 1,
          holiday.date.day
        );
        const holidayTimestamp = holidayDate.getTime();
        if (holidayTimestamp > now && holidayTimestamp < nextHolidayTimestamp) {
          nextHolidayTimestamp = holidayTimestamp;
          nextHoliday = {
            ...holiday,
            timestamp: holidayTimestamp,
            year: currentYear,
          };
        }
      }
      if (nextHoliday) break;
    }
    return nextHoliday;
  }

  #formatTimeRemaining(timestamp) {
    const diff = Math.max(0, timestamp - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 1) return `⏳ ${days}g`;
    if (days === 1) return `⏳ ${days}g ${hours}h`;
    if (hours > 0) return `⏳ ${hours}h ${minutes}m`;
    if (minutes > 1) return `⏳ ${minutes}m`;
    return `⏳ <1m`;
  }

  async #sendCongratulations({ channels, holiday, guild }) {
    const embed = new PresetEmbed({ guild });
    await embed.init(false);
    embed
      .KSuccess(
        `🎉 Oggi è ${holiday.name}! ${holiday.emoji || ""}`,
        `Tanti auguri a tutta la community di **${guild.name}**!`
      )
      .setImage(holiday.imageUrl || null);

    try {
      await channels.congratsChannel.send({
        content: `@everyone`,
        embeds: [embed],
      });
    } catch (e) {
      BotConsole.error(
        `[Holiday - ${guild.name}] Fallito invio congratulazioni.`,
        e
      );
    }
  }

  restart() {
    BotConsole.info("[Holiday] Riavvio sistema festività...");
    this.#isInitialized = false;
    this.#trackedGuilds.clear();
    if (this.#heartbeatTimer) clearInterval(this.#heartbeatTimer);
    this.init();
  }
}
