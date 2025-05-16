import SystemCheck from "../../class/client/SystemCheck.js";
import JsonHandler from "../../class/json/JsonHandler.js";
import BotConsole from "../../class/console/BotConsole.js";

export default class Holiday {
  #jsonHandler = new JsonHandler();
  #holidays = [];
  #guildConfigs = {};
  #activeTimers = new Map();
  #currentYear = new Date().getFullYear();

  async initialize() {
    try {
      const [guildConfig, holidayData] = await Promise.all([
        this.#jsonHandler.readFromFile(
          SystemCheck.getDatabasePath("guildconfig")
        ),
        this.#jsonHandler.readFromUrl(
          SystemCheck.getGithubConfig("holidayDataUrl"),
          SystemCheck.getGithubConfig("token")
        ),
      ]);

      if (!holidayData || !Array.isArray(holidayData.holidays)) {
        throw new Error("Holiday data is missing or invalid");
      }

      this.#guildConfigs = guildConfig || {};
      this.#holidays = holidayData.holidays;
      return true;
    } catch (error) {
      BotConsole.error(
        "Holiday.initialize(): Failed to load holiday data",
        error
      );
      throw error;
    }
  }

  async findNextHoliday() {
    if (!this.#holidays.length) {
      throw new Error("No holidays found");
    }

    const now = Date.now();
    const nextHoliday = this.#holidays.find((holiday) => {
      const date = new Date(
        this.#currentYear,
        holiday.date.month - 1,
        holiday.date.day
      );
      return date.getTime() > now;
    });

    if (nextHoliday) {
      nextHoliday.timestamp = new Date(
        this.#currentYear,
        nextHoliday.date.month - 1,
        nextHoliday.date.day
      ).getTime();
      return nextHoliday;
    }

    this.#currentYear++;
    return this.findNextHoliday(); // ricorsione controllata
  }

  #formatTimeRemaining(timestamp) {
    const diff = timestamp - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  }

  #clearTimers(guildId) {
    const timers = this.#activeTimers.get(guildId);
    if (timers) {
      clearInterval(timers.update);
      clearInterval(timers.check);
      this.#activeTimers.delete(guildId);
    }
  }

  async startHolidayTracking(guild, channels, holiday) {
    try {
      const { nameChannel, timerChannel, congratsChannel } = channels;

      this.#clearTimers(guild.id);

      const timers = {
        update: setInterval(() => {
          const remaining = holiday.timestamp - Date.now();
          if (remaining > 0) {
            nameChannel
              ?.setName(`${holiday.emoji} ${holiday.name}`)
              .catch(console.error);
            timerChannel
              ?.setName(this.#formatTimeRemaining(holiday.timestamp))
              .catch(console.error);
          }
        }, 300000),

        check: setInterval(() => {
          if (Date.now() >= holiday.timestamp) {
            this.#sendCongratulations(congratsChannel, holiday).catch(
              console.error
            );
            this.#clearTimers(guild.id);
          }
        }, 60000),
      };

      this.#activeTimers.set(guild.id, timers);
    } catch (err) {
      BotConsole.error(
        `startHolidayTracking(): Error for guild ${guild.id}`,
        err
      );
    }
  }

  async #sendCongratulations(channel, holiday) {
    try {
      await channel.send({ content: `@everyone Celebrating ${holiday.name}!` });
    } catch (error) {
      BotConsole.error(
        `sendCongratulations(): Failed to send message for ${holiday.name}`,
        error
      );
    }
  }

  async run() {
    try {
      const nextHoliday = await this.findNextHoliday();

      for (const [guildId, config] of Object.entries(this.#guildConfigs)) {
        if (!config?.channel?.holiday) continue;

        try {
          const guild = await client.guilds.fetch(guildId);
          const channels = {
            nameChannel: guild.channels.cache.get(config.channel.holiday.name),
            timerChannel: guild.channels.cache.get(config.channel.holiday.date),
            congratsChannel: guild.channels.cache.get(
              config.channel.holiday.send
            ),
          };

          if (Object.values(channels).every(Boolean)) {
            await this.startHolidayTracking(guild, channels, nextHoliday);
          } else {
            BotConsole.warning(`run(): Missing channels in guild ${guildId}`);
          }
        } catch (guildError) {
          BotConsole.error(`run(): Failed guild setup: ${guildId}`, guildError);
        }
      }
    } catch (error) {
      BotConsole.error("run(): Could not start holiday tracking", error);
    }
  }

  async restart() {
    try {
      for (const guildId of this.#activeTimers.keys()) {
        this.#clearTimers(guildId);
      }
      await this.initialize();
      await this.run();
    } catch (err) {
      BotConsole.error("restart(): Failed to restart holiday tracking", err);
    }
  }
}
