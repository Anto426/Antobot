import BotConsole from "../console/BotConsole.js";
import SystemCheck from "./../client/SystemCheck.js";

class LoadOtherModules {
  #rootPath;
  #modules;

  constructor(rootPath = "./../othermodule") {
    if (typeof rootPath !== "string") {
      throw new TypeError("rootPath must be a string");
    }

    this.#rootPath = rootPath;
    this.#modules = Object.freeze([
      {
        name: "Server",
        path: "serverUpdate.js",
        initMethod: (module) => module.StartServer(),
        requiresFeatureCheck: false,
      },
      {
        name: "Status",
        path: "status.js",
        initMethod: (module) => module.default.start(),
        requiresFeatureCheck: true,
        feature: "status",
      },
      {
        name: "Holiday",
        path: "holiday.js",
        initMethod: (module) => module.default.init(),
        requiresFeatureCheck: true,
        feature: "holiday",
      },
    ]);
  }

  async #loadModule({ path, name, initMethod }) {
    if (!path || !name || !initMethod) {
      throw new Error("Invalid module configuration");
    }

    try {
      const fullPath = `${this.#rootPath}/${path}`;
      const module = await import(fullPath);
      const result = await Promise.resolve(initMethod(module));
      return result;
    } catch (error) {
      throw new Error(`${name} module failed to initialize: ${error.message}`);
    }
  }

  async load() {
    BotConsole.info("Starting to load modules...");

    const moduleResults = this.#modules.map(async (module) => {
      if (
        module.requiresFeatureCheck &&
        !SystemCheck.isFeatureEnabled(module.feature)
      ) {
        BotConsole.info(`${module.name} module is disabled`);
        return { name: module.name, status: "disabled" };
      }

      try {
        await this.#loadModule(module);
        BotConsole.success(`${module.name} module initialized`);
        return { name: module.name, status: "success" };
      } catch (error) {
        BotConsole.error(`${module.name} module failed to initialize`, error);
        return {
          name: module.name,
          status: "failed",
          error: error.message,
        };
      }
    });

    const results = await Promise.allSettled(moduleResults);
    return results.map((result) =>
      result.status === "fulfilled"
        ? result.value
        : {
            name: "Unknown",
            status: "failed",
            error: result.reason?.message || "Unknown error",
          }
    );
  }
}

export default new LoadOtherModules();
