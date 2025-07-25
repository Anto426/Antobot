import BotConsole from "../../../class/console/BotConsole.js";
import ModuleLoader from "../../../class/Loader/ModuleLoader.js";
import StartupLogger from "../../../class/console/LogStartup.js";
import CommandGuildUpdate from "../../../class/Guild/CommandGuildUpdate.js";
import IntitialOtherModules from "../../../class/Loader/IntitialOtherModules.js";
import SqlManager from "../../../class/services/SqlManager.js";
import ConfigManager from "../../../class/services/ConfigManager.js";
export default {
  name: "OnStartUp",
  eventType: "ready",
  isActive: true,
  async execute() {
    (await ModuleLoader.initAll?.()) || Promise.resolve();
    BotConsole.success("Tutti i moduli sono stati caricati correttamente.");
    await CommandGuildUpdate.updateGuildsOnStartup();
    BotConsole.success("Tutte le gilde sono state aggiornate con i comandi.");
    await IntitialOtherModules.Init();
    const sqlConfig = ConfigManager.getConfig("sql");
    await SqlManager.connect(sqlConfig);
    BotConsole.info(
      `[OnStartUp] Connessione al database SQL stabilita con successo.`
    );
    BotConsole.success("Tutti i moduli secondari sono stati inizializzati.");
    await StartupLogger.run();
    client.botready = true;
    BotConsole.success("Bot pronto all’uso!");
  },
};
