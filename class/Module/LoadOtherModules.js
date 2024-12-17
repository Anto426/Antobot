import BotConsole from "../console/BotConsole.js";
import SystemCheck from "./../client/SystemCheck.js";
import { ERROR_CODE } from "./../error/ErrorHandler.js";
class LoadOtherModules {
  #rootPath;
  #modules;

  constructor() {
    this.#rootPath = "./../othermodule";
    this.#modules = [
      {
        name: "Server",
        init: async () => {
          try {
            const { serverUpdate } = await import(
              `${this.#rootPath}/serverUpdate.js`
            );
            const serverUpdateModule = new serverUpdate();
            await serverUpdateModule.init();
            return serverUpdateModule.StartServer();
          } catch (error) {
            throw ERROR_CODE.services.moduleLoader.moduleLoaderother.server;
          }
        },
        requiresFeatureCheck: false,
      },
      {
        name: "Status",
        init: async () => {
          try {

            const Status = await import(`${this.#rootPath}/status.js`);
            return Status.default.start();
          } catch (error) {
            console.log(error);
            throw ERROR_CODE.services.moduleLoader.moduleLoaderother.status;
          }
        },
        requiresFeatureCheck: true,
        feature: "status",
      },
      {
        name: "Holiday",
        init: async () => {
          try {
            const Holiday = await import(`${this.#rootPath}/holiday.js`);
            return Holiday.default.init();
          } catch (error) {
            throw ERROR_CODE.services.moduleLoader.moduleLoaderother.holiday;
          }
        },
        requiresFeatureCheck: true,
        feature: "holiday",
      },
    ];
  }

  async load() {
    BotConsole.info("Starting to load modules...");
    const results = [];

    for (const module of this.#modules) {
      try {
        if (
          module.requiresFeatureCheck &&
          !SystemCheck.isFeatureEnabled(module.feature)
        ) {
          BotConsole.info(`${module.name} module is disabled`);
          continue;
        }

        await module.init();
        BotConsole.success(`${module.name} module initialized`);
        results.push({ name: module.name, status: "success" });
      } catch (error) {
        const errorCode =
          ERROR_CODE.services.moduleLoader.moduleLoaderother.generic;
        BotConsole.error(`${module.name} module failed to initialize:`, error);
        results.push({
          name: module.name,
          status: "error",
          error: error.message,
          code: errorCode.code,
          id: errorCode.id,
        });
      }
    }

    return results;
  }
}

export default new LoadOtherModules();
