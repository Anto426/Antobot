import BotConsole from "../../class/console/BotConsole.js";
import ConfigManager from "../../class/services/ConfigManager.js";

export default class Status {
  #statusUpdateInterval;
  #client;
  static #DEFAULT_INTERVAL = 5 * 60 * 1000;

  constructor() {
    this.#client = client;
    this.#statusUpdateInterval = Status.#DEFAULT_INTERVAL;
  }

  #validateStatusData(statusData) {
    return statusData?.status?.length > 0;
  }

  #getRandomStatus(statusList) {
    return statusList[Math.floor(Math.random() * statusList.length)];
  }

  async updateStatus() {
    try {
      const statusData = await ConfigManager.getConfig("status");

      if (!this.#validateStatusData(statusData)) {
        throw new Error("Invalid status data");
      }

      const randomStatus = this.#getRandomStatus(statusData.status);

      await this.#client.user.setPresence({
        activities: [
          {
            name: randomStatus.description,
            type: randomStatus.type,
          },
        ],
        status: "online",
      });

      BotConsole.info(`Status updated: ${randomStatus.description}`);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  setUpdateInterval(milliseconds) {
    if (typeof milliseconds === "number" && milliseconds > 0) {
      this.#statusUpdateInterval = milliseconds;
    }
  }

  run() {
    this.updateStatus().catch((error) =>
      BotConsole.error("Initial status update failed", error)
    );

    return setInterval(() => {
      this.updateStatus().catch((error) =>
        BotConsole.error("Status update failed", error)
      );
    }, this.#statusUpdateInterval);
  }

  stop(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
      return true;
    }
    return false;
  }
}
