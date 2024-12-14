import { ERROR_CODE } from "../error/ErrorHandler.js";
import BotConsole from "../console/BotConsole.js";

class LoadOtherModules {
  #console;
  #check;
  #serverUpdate;

  constructor() {
    this.#console = BotConsole;
  }

  async load() {
    this.#console.info("Starting to load modules...");

    try {
      await this.#initializeServer();
    } catch (error) {
      this.#console.error("Server module failed to initialize:", error);
    }

    try {
      await this.#initializeStatus();
    } catch (error) {
      this.#console.error("Status module failed to initialize:", error);
    }

    try {
      await this.#initializeHoliday();
    } catch (error) {
      this.#console.error("Holiday module failed to initialize:", error);
    }
  }

  async #initializeServer() {
    const { serverUpdate } = await import("../../webhook/serverUpdate.js");
    this.#serverUpdate = new serverUpdate();
    await this.#serverUpdate.init();
    await this.#serverUpdate.StartServer();
    this.#console.success("Server module initialized");
  }

  async #initializeStatus() {
    const { Check } = await import("../check/check.js");
    this.#check = new Check();

    if (!(await this.#check.checkAllowStatus())) {
      this.#console.info("Status module is disabled");
      return;
    }

    const { Status } = await import("../status/status.js");
    global.client.statusmodule = new Status();
    global.client.statusmodule.updateStatus();
    global.client.statusmodule.updateStatusEveryFiveMinutes();
    this.#console.success("Status module initialized");
  }

  async #initializeHoliday() {
    if (!this.#check) {
      const { Check } = await import("../check/check.js");
      this.#check = new Check();
    }

    if (!(await this.#check.checkAllowHoliday())) {
      this.#console.info("Holiday module is disabled");
      return;
    }

    const { Holiday } = await import("../holiday/holiday.js");
    global.client.holidaymodule = new Holiday();
    await global.client.holidaymodule.init();
    global.client.holidaymodule.main();
    this.#console.success("Holiday module initialized");
  }
}

export default new LoadOtherModules();
