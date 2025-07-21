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
    (await ModuleLoader.initAll?.()) || Promise.resolve();
    BotConsole.success("Tutti i moduli sono stati caricati correttamente.");
    await CommandGuildUpdate.updateGuildsOnStartup();
    BotConsole.success("Tutte le gilde sono state aggiornate con i comandi.");
    await SynchronizationManager.synchronizeAll();
    BotConsole.success("Tutte le gilde sono state sincronizzate.");
    await IntitialOtherModules.Init();
    BotConsole.success("Tutti i moduli secondari sono stati inizializzati.");
    await StartupLogger.run();
    client.botready = true;
    BotConsole.success("Bot pronto all’uso!");
  },
};
