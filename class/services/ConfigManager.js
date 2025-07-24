import SystemCheck from "../client/SystemCheck.js";
import BotConsole from "../console/BotConsole.js";
import JsonHandler from "../Json/JsonHandler.js";
import { EventEmitter } from "events";

class ConfigManager extends EventEmitter {
  constructor(baseURL = "") {
    super();
    this.json = new JsonHandler();
    this.store = {};
    this.baseURL = baseURL;
  }

  async loadConfig() {
    const files = Array.isArray(SystemCheck.getGithubConfig("files"))
      ? SystemCheck.getGithubConfig("files")
      : [];
    const repoUrl = SystemCheck.getGithubConfig("urlrepo") || this.baseURL;
    if (!repoUrl) {
      throw new Error("URL del repository GitHub non configurato.");
    }

    BotConsole.info("Caricamento configurazione dal repo GitHub:", repoUrl);
    BotConsole.info("File da caricare:", files);

    const jsonFiles = files.filter((f) => f.toLowerCase().endsWith(".json"));
    if (!jsonFiles.length) {
      throw new Error(
        "Nessun file JSON da caricare trovato nella configurazione."
      );
    }

    const newStore = {};
    for (const file of jsonFiles) {
      try {
        const data = await this.json.readFromUrl(
          `${repoUrl}/${file.toLowerCase()}`,
          process.env.GITTOKEN
        );
        // Rimuove l'estensione .json per creare la chiave dello store
        newStore[file.replace(/\.json$/i, "")] = data;
        BotConsole.success(`File '${file}' caricato con successo.`);
      } catch (err) {
        BotConsole.error(
          `Errore durante il caricamento di '${file}': ${err.message}`
        );
      }
    }

    this.store = newStore;
    this.emit("reload", { timestamp: new Date(), store: this.store });
    return this.store;
  }

  getConfig(path) {
    if (!path) {
      throw new Error("Il percorso della configurazione è obbligatorio.");
    }
    const [file, ...keys] = path.split(".");
    let result = this.store[file];
    if (result === undefined) {
      throw new Error(`File di configurazione non trovato: ${file}`);
    }
    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        throw new Error(`Chiave '${key}' non trovata nel file ${file}.`);
      }
    }
    return result;
  }

  getAllConfig() {
    if (!Object.keys(this.store).length) {
      throw new Error("Nessun file di configurazione è stato caricato.");
    }
    return { ...this.store };
  }
}

export default new ConfigManager();
