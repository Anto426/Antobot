import SystemCheck from "../client/SystemCheck.js";
import BotConsole from "../console/BotConsole.js";

class IntitialOtherModules {
  async Intit() {
    try {
      client.other.forEach((module, key, map) => {
        if (SystemCheck.isFeatureEnabled(module.name.toLowerCase())) {
          if (typeof module === "function") {
            const instance = new module();

            try {
              instance.run();
              BotConsole.success(
                `Module ${module.name} initialized successfully`
              );
              map.set(key, instance);
            } catch (error) {
              BotConsole.error(
                `Failed to initialize module ${module.name}: ${error.message}`
              );
            }
          } else {
            BotConsole.success(`Module ${module.name} already initialized`);
          }
        } else {
          BotConsole.warning(`Module ${module.name} is disabled`);
        }
      });
    } catch (error) {
      BotConsole.error("Failed to initialize other modules", error);
    }
  }
}

export default new IntitialOtherModules();
