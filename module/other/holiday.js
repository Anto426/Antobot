import BotConsole from "../../class/console/BotConsole.js";
import SqlManager from "../../class/Sql/SqlManager.js";
import ConfigManager from "../../class/ConfigManager/ConfigManager.js"; // Istanza Singleton
import PresetEmbed from "../../class/embed/PresetEmbed.js";
import { PermissionsBitField } from "discord.js";

export default class Holiday {
  #holidays = [];
  #activeTimers = new Map();
  #currentYear;
  #isInitialized = false;

  constructor() {
    this.#currentYear = new Date().getFullYear();
  }

  async #loadHolidayData() {
    BotConsole.info(
      "Holiday.#loadHolidayData(): Tentativo di caricamento dati festività da ConfigManager..."
    );
    try {
      const holidayList = ConfigManager.getConfig("hollyday").holidays;

      if (
        !holidayList ||
        !Array.isArray(holidayList) ||
        holidayList.length === 0
      ) {
        BotConsole.error(
          "Holiday.#loadHolidayData(): Dati festività mancanti, non validi o array vuoto da ConfigManager.",
          holidayList
        );
        this.#isInitialized = false;
        throw new Error(
          "Dati festività non validi o mancanti da ConfigManager."
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
        .filter(
          (h) =>
            !isNaN(h.date.month) &&
            !isNaN(h.date.day) &&
            h.date.month >= 1 &&
            h.date.month <= 12 &&
            h.date.day >= 1 &&
            h.date.day <= 31
        );

      if (this.#holidays.length === 0) {
        BotConsole.error(
          "Holiday.#loadHolidayData(): Nessuna festività valida trovata dopo il parsing da ConfigManager."
        );
        this.#isInitialized = false;
        throw new Error("Nessuna festività valida trovata da ConfigManager.");
      }

      BotConsole.success(
        `Holiday.#loadHolidayData(): Caricate ${
          this.#holidays.length
        } definizioni di festività da ConfigManager.`
      );
      this.#isInitialized = true;
      this.#currentYear = new Date().getFullYear();
      return true;
    } catch (error) {
      BotConsole.error(
        "Holiday.#loadHolidayData(): Fallito caricamento dati festività da ConfigManager.",
        error
      );
      this.#isInitialized = false;
      throw error; // Rilancia per notificare il chiamante
    }
  }

  // --- Metodi #findNextHolidayInternal, findNextHoliday, #formatTimeRemaining, #clearTimers ---
  // (Questi rimangono IDENTICI, non dipendono da *come* #holidays viene popolato)
  #findNextHolidayInternal(yearToSearch) {
    const now = Date.now();
    let nextHoliday = null;
    let nextHolidayTimestamp = Infinity;

    for (const holiday of this.#holidays) {
      if (
        isNaN(holiday.date.month) ||
        isNaN(holiday.date.day) ||
        holiday.date.month < 1 ||
        holiday.date.month > 12 ||
        holiday.date.day < 1 ||
        holiday.date.day > 31
      ) {
        BotConsole.warning(
          `[Holiday Internal] Festività "${holiday.name}" ha una data non valida, saltata:`,
          holiday.date
        );
        continue;
      }
      const holidayDate = new Date(
        yearToSearch,
        holiday.date.month - 1,
        holiday.date.day,
        0,
        0,
        0,
        0
      );
      const holidayTimestamp = holidayDate.getTime();

      if (holidayTimestamp > now && holidayTimestamp < nextHolidayTimestamp) {
        nextHolidayTimestamp = holidayTimestamp;
        nextHoliday = {
          ...holiday,
          timestamp: holidayTimestamp,
          year: yearToSearch,
        };
      }
    }
    return nextHoliday;
  }

  async findNextHoliday() {
    if (!this.#isInitialized || !this.#holidays.length) {
      BotConsole.error(
        "Holiday.findNextHoliday(): Dati festività non caricati. Tentare prima this.run() o this.#loadHolidayData()."
      );
      throw new Error("Dati festività non caricati.");
    }

    let yearToTry = this.#currentYear;
    let nextHoliday = this.#findNextHolidayInternal(yearToTry);

    if (!nextHoliday) {
      BotConsole.info(
        `[Holiday] Nessuna festività imminente per ${yearToTry}. Controllo ${
          yearToTry + 1
        }...`
      );
      nextHoliday = this.#findNextHolidayInternal(yearToTry + 1);
    }

    if (nextHoliday) {
      BotConsole.info(
        `[Holiday] Prossima festività: ${nextHoliday.name} il ${new Date(
          nextHoliday.timestamp
        ).toLocaleDateString("it-IT")} (Anno di ricerca: ${nextHoliday.year})`
      );
    } else {
      BotConsole.warning(
        `[Holiday] Nessuna festività futura trovata anche per l'anno ${
          yearToTry + 1
        }.`
      );
    }
    return nextHoliday;
  }

  #formatTimeRemaining(timestamp) {
    const diff = Math.max(0, timestamp - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

    if (days > 0) return `${days}g ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return "<1m";
  }

  #clearTimers(guildId) {
    const timers = this.#activeTimers.get(guildId);
    if (timers) {
      if (timers.update) clearInterval(timers.update);
      if (timers.check) clearInterval(timers.check);
      this.#activeTimers.delete(guildId);
      BotConsole.info(
        `[Holiday] Timers festività cancellati per gilda ${guildId}.`
      );
    }
  }

  // --- Metodi startHolidayTracking, #sendCongratulations, processGuild ---
  // (La logica interna di questi metodi rimane sostanzialmente la stessa,
  //  si basano su this.#holidays, client e SqlManager globale)

  async startHolidayTracking(guild, channels, holiday) {
    const guildLogPrefix = `[Holiday - ${guild.name} (${guild.id})]`;
    BotConsole.info(
      `${guildLogPrefix} Avvio tracking per: ${holiday.name} (${new Date(
        holiday.timestamp
      ).toLocaleDateString("it-IT")})`
    );

    try {
      const { categoryChannel, voiceTimerChannel, textCongratsChannel } =
        channels;
      this.#clearTimers(guild.id);

      const initialTimeRemaining = this.#formatTimeRemaining(holiday.timestamp);
      const holidayDisplayName = `${holiday.emoji || "🎉"} ${holiday.name}`;

      if (categoryChannel)
        await categoryChannel
          .setName(holidayDisplayName.slice(0, 100))
          .catch((e) =>
            BotConsole.error(
              `${guildLogPrefix} Errore rinominando categoria ${categoryChannel.id}:`,
              e.message
            )
          );
      if (voiceTimerChannel)
        await voiceTimerChannel
          .setName(initialTimeRemaining.slice(0, 100))
          .catch((e) =>
            BotConsole.error(
              `${guildLogPrefix} Errore rinominando canale timer ${voiceTimerChannel.id}:`,
              e.message
            )
          );

      const timers = {
        update: setInterval(async () => {
          const remainingMs = holiday.timestamp - Date.now();
          if (remainingMs > 0) {
            const timeStr = this.#formatTimeRemaining(holiday.timestamp);
            if (voiceTimerChannel?.name !== timeStr) {
              await voiceTimerChannel
                .setName(timeStr.slice(0, 100))
                .catch((e) =>
                  BotConsole.error(
                    `${guildLogPrefix} Errore aggiornando nome canale timer ${voiceTimerChannel.id}:`,
                    e.message
                  )
                );
            }
            if (categoryChannel?.name !== holidayDisplayName) {
              await categoryChannel
                .setName(holidayDisplayName.slice(0, 100))
                .catch((e) =>
                  BotConsole.error(
                    `${guildLogPrefix} Errore ri-settando nome categoria ${categoryChannel.id}:`,
                    e.message
                  )
                );
            }
          } else {
            this.#clearTimers(guild.id);
          }
        }, 5 * 60 * 1000),

        check: setInterval(async () => {
          if (Date.now() >= holiday.timestamp) {
            BotConsole.info(
              `${guildLogPrefix} Festività ${holiday.name} è ARRIVATA! Invio congratulazioni.`
            );
            await this.#sendCongratulations(
              textCongratsChannel,
              holiday,
              guild
            ).catch((e) =>
              BotConsole.error(
                "Errore inviando congratulazioni da check timer:",
                e
              )
            );

            const defaultCategoryName = "🎉 Eventi Speciali 🎉";
            const defaultVoiceName = "🥳 sala-evento";
            if (categoryChannel?.name !== defaultCategoryName)
              await categoryChannel
                .setName(defaultCategoryName)
                .catch((e) =>
                  BotConsole.warning(
                    `${guildLogPrefix} Errore resettando nome categoria ${categoryChannel.id}:`,
                    e.message
                  )
                );
            if (voiceTimerChannel?.name !== defaultVoiceName)
              await voiceTimerChannel
                .setName(defaultVoiceName)
                .catch((e) =>
                  BotConsole.warning(
                    `${guildLogPrefix} Errore resettando nome canale vocale ${voiceTimerChannel.id}:`,
                    e.message
                  )
                );

            this.#clearTimers(guild.id);

            if (
              holiday.year === this.#currentYear &&
              new Date().getFullYear() === this.#currentYear
            ) {
              const stillNextInCurrentYear = this.#findNextHolidayInternal(
                this.#currentYear
              );
              if (!stillNextInCurrentYear) {
                BotConsole.info(
                  `[Holiday] Avanzamento anno di ricerca a ${
                    this.#currentYear + 1
                  }.`
                );
                this.#currentYear++;
              }
            }
            BotConsole.info(
              `${guildLogPrefix} Ricerca prossima festività dopo ${holiday.name}...`
            );
            await this.processGuild(guild);
          }
        }, 30 * 1000),
      };
      this.#activeTimers.set(guild.id, timers);
    } catch (err) {
      BotConsole.error(
        `${guildLogPrefix} Errore in startHolidayTracking per ${holiday.name}:`,
        err
      );
    }
  }

  async #sendCongratulations(channel, holiday, guild) {
    const guildLogPrefix = `[Holiday - ${guild.name} (${guild.id})]`;
    if (!channel || !channel.isTextBased()) {
      BotConsole.error(
        `${guildLogPrefix} Canale congratulazioni non valido o non testuale per ${holiday.name}. ID Canale: ${channel?.id}`
      );
      return;
    }
    try {
      const embed = await new PresetEmbed({ guild }).init(false); // Assumendo che PresetEmbed esista e funzioni
      embed
        .KSuccess(
          `🎉 Oggi è ${holiday.name}! ${holiday.emoji || ""}`,
          `Tanti auguri a tutta la community di **${guild.name}**!`
        )
        .setThumbnail(
          guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL()
        )
        .setImage(holiday.imageUrl || null);

      await channel.send({
        content: `@everyone Oggi si festeggia **${holiday.name}**! ${
          holiday.emoji || ""
        }`,
        embeds: [embed],
      });
      BotConsole.success(
        `${guildLogPrefix} Messaggio congratulazioni inviato per ${holiday.name} in ${channel.name}.`
      );
    } catch (error) {
      BotConsole.error(
        `${guildLogPrefix} Fallito invio congratulazioni per ${holiday.name} in ${channel.name}:`,
        error
      );
    }
  }

  async processGuild(guild) {
    if (!this.#isInitialized) {
      BotConsole.warning(
        `[Holiday - ${guild.name}] Tentativo di processare gilda ma dati festività non caricati.`
      );
      return;
    }
    const guildLogPrefix = `[Holiday - ${guild.name} (${guild.id})]`;
    BotConsole.info(`${guildLogPrefix} Processo festività per la gilda...`);

    try {
      const guildConfigDb = await SqlManager.getGuildById(guild.id);
      if (!guildConfigDb || !guildConfigDb.HOLYDAY_ID) {
        BotConsole.info(
          `${guildLogPrefix} Gilda non ha HOLYDAY_ID configurato. Salto tracking.`
        );
        this.#clearTimers(guild.id);
        return;
      }

      const holydaySetup = await SqlManager.getHollydayById(
        guildConfigDb.HOLYDAY_ID
      );
      if (!holydaySetup) {
        BotConsole.warning(
          `${guildLogPrefix} Record HOLYDAY con ID ${guildConfigDb.HOLYDAY_ID} non trovato. Salto.`
        );
        this.#clearTimers(guild.id);
        return;
      }

      const channels = {
        categoryChannel: holydaySetup.CATEGORY_CH
          ? await guild.channels.fetch(holydaySetup.CATEGORY_CH).catch(() => {
              BotConsole.warning(
                `${guildLogPrefix} Categoria ${holydaySetup.CATEGORY_CH} non trovata.`
              );
              return null;
            })
          : null,
        voiceTimerChannel: holydaySetup.HOLYDAY_CHANNEL
          ? await guild.channels
              .fetch(holydaySetup.HOLYDAY_CHANNEL)
              .catch(() => {
                BotConsole.warning(
                  `${guildLogPrefix} Canale Vocale Timer ${holydaySetup.HOLYDAY_CHANNEL} non trovato.`
                );
                return null;
              })
          : null,
        textCongratsChannel: holydaySetup.NAME_CHANNEL
          ? await guild.channels.fetch(holydaySetup.NAME_CHANNEL).catch(() => {
              BotConsole.warning(
                `${guildLogPrefix} Canale Testo Congrats ${holydaySetup.NAME_CHANNEL} non trovato.`
              );
              return null;
            })
          : null,
      };

      if (
        !channels.textCongratsChannel ||
        !channels.voiceTimerChannel ||
        !channels.categoryChannel
      ) {
        BotConsole.warning(
          `${guildLogPrefix} Uno o più canali festività non trovati (post-fetch). Tracking interrotto.`
        );
        this.#clearTimers(guild.id);
        return;
      }

      const botMember = await guild.members.fetchMe();
      if (
        !channels.categoryChannel
          .permissionsFor(botMember)
          .has(PermissionsBitField.Flags.ManageChannels) ||
        !channels.voiceTimerChannel
          .permissionsFor(botMember)
          .has(PermissionsBitField.Flags.ManageChannels) ||
        !channels.textCongratsChannel
          .permissionsFor(botMember)
          .has(PermissionsBitField.Flags.SendMessages) ||
        !channels.textCongratsChannel
          .permissionsFor(botMember)
          .has(PermissionsBitField.Flags.EmbedLinks)
      ) {
        BotConsole.warning(
          `${guildLogPrefix} Bot non ha permessi necessari sui canali festività. Tracking interrotto.`
        );
        this.#clearTimers(guild.id);
        return;
      }

      const nextHoliday = await this.findNextHoliday();
      if (nextHoliday) {
        await this.startHolidayTracking(guild, channels, nextHoliday);
      } else {
        BotConsole.warning(
          `${guildLogPrefix} Nessuna prossima festività trovata. Nessun tracking avviato.`
        );
        this.#clearTimers(guild.id);
        if (channels.categoryChannel?.name !== "🎉 Eventi Speciali 🎉")
          await channels.categoryChannel
            .setName("🎉 Eventi Speciali 🎉")
            .catch((e) =>
              BotConsole.warning(
                `${guildLogPrefix} Errore resettando nome categoria:`,
                e.message
              )
            );
        if (channels.voiceTimerChannel?.name !== "🥳 sala-evento")
          await channels.voiceTimerChannel
            .setName("🥳 sala-evento")
            .catch((e) =>
              BotConsole.warning(
                `${guildLogPrefix} Errore resettando nome canale vocale:`,
                e.message
              )
            );
      }
    } catch (guildError) {
      BotConsole.error(
        `${guildLogPrefix} Errore durante il setup del tracking festività:`,
        guildError
      );
      console.error(guildError);
      this.#clearTimers(guild.id);
    }
  }

  async run() {
    if (!this.#isInitialized) {
      BotConsole.info(
        "[Holiday] Dati festività non inizializzati. Tentativo di caricamento..."
      );
      try {
        await this.#loadHolidayData();
      } catch (loadError) {
        // L'errore è già loggato da #loadHolidayData. Qui decidiamo solo se fermare run.
        BotConsole.error(
          "Holiday.run(): Fallito caricamento dati festività. Sistema Holiday NON avviato."
        );
        return;
      }
    }
    if (!this.#isInitialized) {
      BotConsole.error(
        "Holiday.run(): Caricamento dati festività ancora fallito dopo tentativo. Impossibile avviare."
      );
      return;
    }

    BotConsole.info(
      "[Holiday] Avvio processo tracking festività per tutte le gilde..."
    );
    for (const guild of client.guilds.cache.values()) {
      await this.processGuild(guild);
    }
  }

  async stopGuildTracking(guildId) {
    BotConsole.info(
      `[Holiday] Richiesta interruzione tracking per gilda ${guildId}`
    );
    this.#clearTimers(guildId);
    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return;
      const guildConfigDb = await SqlManager.getGuildById(guildId);
      if (guildConfigDb && guildConfigDb.HOLYDAY_ID) {
        const holydaySetup = await SqlManager.getHollydayById(
          guildConfigDb.HOLYDAY_ID
        );
        if (holydaySetup) {
          const catCh = holydaySetup.CATEGORY_CH
            ? await guild.channels
                .fetch(holydaySetup.CATEGORY_CH)
                .catch(() => null)
            : null;
          const vcCh = holydaySetup.HOLYDAY_CHANNEL
            ? await guild.channels
                .fetch(holydaySetup.HOLYDAY_CHANNEL)
                .catch(() => null)
            : null;
          if (catCh?.name !== "🎉 Eventi Speciali 🎉")
            await catCh
              .setName("🎉 Eventi Speciali 🎉")
              .catch((e) =>
                BotConsole.warning(`Errore reset nome cat: ${e.message}`)
              );
          if (vcCh?.name !== "🥳 sala-evento")
            await vcCh
              .setName("🥳 sala-evento")
              .catch((e) =>
                BotConsole.warning(`Errore reset nome vc: ${e.message}`)
              );
        }
      }
    } catch (error) {
      BotConsole.error(
        `[Holiday] Errore reset nomi canali per ${guildId} stopTracking:`,
        error
      );
    }
  }

  async restart() {
    BotConsole.info("[Holiday] Riavvio sistema tracking festività...");
    try {
      for (const guildId of this.#activeTimers.keys()) {
        this.#clearTimers(guildId);
      }
      this.#activeTimers.clear();

      await this.#loadHolidayData(); // Ricarica i dati delle festività

      if (this.#isInitialized) {
        await this.run(); // Run si occuperà di processare le gilde
        BotConsole.success("[Holiday] Sistema tracking festività riavviato.");
      } else {
        BotConsole.error(
          "[Holiday] Riavvio fallito: impossibile ricaricare i dati delle festività."
        );
      }
    } catch (err) {
      BotConsole.error("[Holiday] Fallito riavvio tracking:", err);
    }
  }

  cleanupGuild(guildId) {
    BotConsole.info(
      `[Holiday] Pulizia timers per gilda ${guildId} (bot ha lasciato/rimosso).`
    );
    this.#clearTimers(guildId);
  }
}
