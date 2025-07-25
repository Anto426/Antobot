import BotConsole from "../../class/console/BotConsole.js";
import SynchronizationManager from "../../class/services/SynchronizationManager.js";


export default class Synchronize {
  #intervalId;
  #synchronizationInterval;
  static #DEFAULT_INTERVAL = 60 * 60 * 1000; 

  constructor() {
    this.#intervalId = null;
    this.#synchronizationInterval = Synchronize.#DEFAULT_INTERVAL;
  }


  setSynchronizationInterval(milliseconds) {
    if (typeof milliseconds === "number" && milliseconds > 0) {
      this.#synchronizationInterval = milliseconds;
      BotConsole.info(
        `[Synchronize] Intervallo di sincronizzazione impostato a ${
          milliseconds / 1000
        } secondi.`
      );
    } else {
      BotConsole.warning(
        `[Synchronize] Tentativo di impostare un intervallo non valido: ${milliseconds}`
      );
    }
  }

  run() {
    if (this.#intervalId) {
      BotConsole.warning(
        "[Synchronize] Il processo di sincronizzazione è già in esecuzione."
      );
      return;
    }

    BotConsole.info(
      "[Synchronize] Avvio del processo di sincronizzazione periodica..."
    );

    SynchronizationManager.synchronizeAll().catch((error) =>
      BotConsole.error(
        "[Synchronize] Sincronizzazione iniziale fallita.",
        error
      )
    );

    this.#intervalId = setInterval(() => {
      BotConsole.info("[Synchronize] Avvio sincronizzazione programmata...");
      SynchronizationManager.synchronizeAll().catch((error) =>
        BotConsole.error(
          "[Synchronize] Sincronizzazione programmata fallita.",
          error
        )
      );
    }, this.#synchronizationInterval);

    BotConsole.success(
      `[Synchronize] Sincronizzazione periodica avviata con intervallo di ${
        this.#synchronizationInterval / 1000 / 60
      } minuti.`
    );
  }

  stop() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
      BotConsole.info("[Synchronize] Processo di sincronizzazione interrotto.");
      return true;
    }
    BotConsole.warning(
      "[Synchronize] Nessun processo di sincronizzazione da interrompere."
    );
    return false;
  }
}
