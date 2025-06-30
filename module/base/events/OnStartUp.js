import BotConsole from "../../../class/console/BotConsole.js";
import ModuleLoader from "../../../class/Loader/ModuleLoader.js";
import StartupLogger from "../../../class/console/LogStartup.js";
import CommandGuildUpdate from "../../../class/Guild/CommandGuildUpdate.js";
import IntitialOtherModules from "../../../class/Loader/IntitialOtherModules.js";
import SynchronizationManager from "../../../class/services/SynchronizationManager.js";
export default {
  name: "OnStartUp",
  eventType: "ready",
  isActive: true,
  async execute() {
    client.botready = true;
    BotConsole.success("Bot pronto all’uso!");
    (await ModuleLoader.initAll?.()) || Promise.resolve();
    await CommandGuildUpdate.updateGuildsOnStartup();
    await SynchronizationManager.synchronizeAll();
    await IntitialOtherModules.Init();
    await StartupLogger.run();
  },
};
