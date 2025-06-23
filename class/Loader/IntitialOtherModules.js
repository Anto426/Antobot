import SystemCheck from "../client/SystemCheck.js";
import BotConsole from "../console/BotConsole.js";

class IntitialOtherModules {

  async Init() {

    for (const [key, moduleToLoad] of client.other.entries()) {
      if (typeof moduleToLoad === "function") {
        const moduleName = moduleToLoad.name;

        if (!SystemCheck.isFeatureEnabled(moduleName.toLowerCase())) {
          BotConsole.warning(`Modulo "${moduleName}" è disabilitato.`);
          client.other.delete(key);
          continue;
        }

        try {
          BotConsole.info(
            `Inizializzazione e sovrascrittura modulo: ${moduleName}...`
          );

          const instance = new moduleToLoad();

          if (typeof instance.init === "function") {
            await instance.init();
          } else if (typeof instance.run === "function") {
            await instance.run();
          } 
          client.other.set(key, instance);

          BotConsole.success(
            `Modulo ${moduleName} (${key}) inizializzato e sovrascritto.`
          );
        } catch (error) {
          BotConsole.error(
            `Fallita inizializzazione del modulo ${moduleName}. Verrà rimosso.`,
            error
          );
          client.other.delete(key);
        }
      }
    }
    BotConsole.info("Processo di sovrascrittura dei moduli completato.");
  }
}

export default new IntitialOtherModules();
