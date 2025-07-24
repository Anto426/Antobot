import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import readline from "readline";
import BotConsole from "../console/BotConsole.js";
import ModuleLoader from "../Loader/ModuleLoader.js";
import ConfigManager from "../services/ConfigManager.js";
import SystemCheck from "./SystemCheck.js";
import clientInitializer from "./ClientInitializer.js";
import dotenv from "dotenv";
dotenv.config();

class BotApplication {
  constructor() {
    this.ModuleLoader = new ModuleLoader();
    this.clientInitializer = new clientInitializer();

    const { promptToken } = yargs(hideBin(process.argv))
      .option("promptToken", {
        alias: "t",
        type: "boolean",
        description: "Richiedi il token all’avvio",
      })
      .help("h")
      .version("v")
      .strict().argv;

    this.promptToken = promptToken;
    this.configManager = ConfigManager;

    this._token = this.promptToken ? null : process.env.TOKEN || null;
    this.botClient = null;
  }

  async _askToken() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    BotConsole.info("Inserisci il token del bot Discord:");
    const token = await new Promise((resolve, reject) =>
      rl.question("Token: ", (input) => {
        const trimmed = input.trim();
        rl.close();
        if (!trimmed) return reject(new Error("Token vuoto"));
        if (trimmed.length < 50) return reject(new Error("Token troppo corto"));
        resolve(trimmed);
      })
    );

    return token;
  }

  async fetchToken() {
    if (!this._token) {
      try {
        this._token = await this._askToken();
        BotConsole.success("Token memorizzato");
        process.env.TOKEN = this._token;
      } catch (err) {
        BotConsole.error("Errore nel token:", err.message);
        throw err;
      }
    }

    return this._token;
  }

  async bootstrap() {
    await SystemCheck.initialize();
    await this.configManager.loadConfig();
    this.clientInitializer.setCookies(
      this.configManager.getConfig("cookies").youtube
    );
    this.botClient = await this.clientInitializer.initialize();
    await this.ModuleLoader.initialize();
  }

  async authenticate() {
    const token = await this.fetchToken();
    await client.login(token);
    BotConsole.success(`Connesso come ${client.user.tag}`);
  }

  async run() {
    try {
      BotConsole.info("Avvio del bot...");
      await this.bootstrap();
      await this.authenticate();
    } catch (err) {
      BotConsole.error("Errore durante l’avvio:", err.message);
      process.exit(1);
    }
  }

  async reloadAllApplications() {
    BotConsole.info("🚀 Riavvio del bot in corso...");

    if (global.distube) {
      BotConsole.info("Disconnessione di Distube...");
      global.distube = null;
    }

    BotConsole.info("Disconnessione del client Discord...");
    await client.destroy();

    BotConsole.success("Processo terminato.Si occuperà del riavvio.");
    process.exit(0);
  }
}

export default new BotApplication();
