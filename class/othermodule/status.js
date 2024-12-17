import JsonHandler from "../json/JsonHandler.js";
import SystemCheck from "../client/SystemCheck.js";
import { ERROR_CODE } from "../error/ErrorHandler.js";
import BotConsole from "../console/BotConsole.js";


class Status {
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
        throw ERROR_CODE.services.status.config;
      }

      const statusUrl = `${githubConfig}/status.json`;
      return await this.#jsonHandler.readFromUrl(statusUrl, process.env.GITTOKEN);
    } catch (error) {
      throw ERROR_CODE.services.status.fetch;
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
        throw ERROR_CODE.services.status.validation;
      }

      const randomStatus = this.#getRandomStatus(statusData.status);
      
      await this.#client.user.setPresence({
        activities: [{
          name: randomStatus.description,
          type: randomStatus.type
        }],
        status: 'online'
      });

      BotConsole.warning(`Status updated: ${randomStatus.description}`);
      return true;
    } catch (error) {
      BotConsole.error('Failed to update status');
      throw ERROR_CODE.services.status.update;
    }
  }

  setUpdateInterval(milliseconds) {
    if (typeof milliseconds === 'number' && milliseconds > 0) {
      this.#statusUpdateInterval = milliseconds;
    }
  }

  start() {
    this.updateStatus().catch(error => 
      BotConsole.error('Initial status update failed')
    );
    
    return setInterval(() => {
      this.updateStatus().catch(error => 
        BotConsole.error('Status update failed')
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

export default new Status;
