import JsonHandler from "../../class/json/JsonHandler.js";
import SystemCheck from "../../class/client/SystemCheck.js";
import BotConsole from "../../class/console/BotConsole.js";

export default class Status {
  #jsonHandler;
  #statusUpdateInterval;
  #client;
  static #DEFAULT_INTERVAL = 5 * 60 * 1000;

  constructor() {
    this.#client = client;
    this.#jsonHandler = new JsonHandler();
    this.#statusUpdateInterval = Status.#DEFAULT_INTERVAL;
  }

  async #fetchStatusData() {
    try {
      const githubConfig = SystemCheck.getGithubConfig("urlrepo");
      if (!githubConfig) {
        throw new Error("Invalid GitHub config");
      }

      const statusUrl = `${githubConfig}/status.json`;
      return await this.#jsonHandler.readFromUrl(
        statusUrl,
        process.env.GITTOKEN
      );
    } catch (error) {
      throw new Error("Failed to fetch status data", error);
    }
  }

  #validateStatusData(statusData) {
    return statusData?.status?.length > 0;
  }

  #getRandomStatus(statusList) {
    return statusList[Math.floor(Math.random() * statusList.length)];
  }

  async updateStatus() {
    try {
      const statusData = await this.#fetchStatusData();

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

      BotConsole.warning(`Status updated: ${randomStatus.description}`);
      return true;
    } catch (error) {
      throw new Error("Failed to update status", error);
    }
  }

  setUpdateInterval(milliseconds) {
    if (typeof milliseconds === "number" && milliseconds > 0) {
      this.#statusUpdateInterval = milliseconds;
    }
  }

  run() {
    this.updateStatus().catch((error) =>
      BotConsole.error("Initial status update failed")
    );

    return setInterval(() => {
      this.updateStatus().catch((error) =>
        BotConsole.error("Status update failed")
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


