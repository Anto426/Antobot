
import SystemCheck from "../client/SystemCheck.js";
import BotConsole from "../console/BotConsole.js";
import JsonHandler from "../json/JsonHandler.js";
import { EventEmitter } from "events";

class ConfigManager extends EventEmitter {
  constructor(baseURL = "") {
    super();
    this.json = new JsonHandler();
    this.store = {};
    this.baseURL = baseURL;
    this._reloadTimer = null;
  }

  async loadConfig() {
    const files = Array.isArray(SystemCheck.getGithubConfig("files"))
      ? SystemCheck.getGithubConfig("files")
      : [];

    const repoUrl = SystemCheck.getGithubConfig("urlrepo") || this.baseURL;
    if (!repoUrl) {
      throw new Error("GitHub repo URL not configured");
    }

    BotConsole.info("Loading config from GitHub repo:", repoUrl);
    BotConsole.info("Files to load:", files);

    const jsonFiles = files.filter((f) => f.toLowerCase().endsWith(".json"));
    if (!jsonFiles.length) {
      throw new Error("No JSON config files to load");
    }

    const newStore = {};
    for (const file of jsonFiles) {
      try {
        const data = await this.json.readFromUrl(
          `${repoUrl}/${file.toLowerCase()}`,
          process.env.GITTOKEN
        );
        newStore[file.replace(".json", "")] = data;
        BotConsole.success(`Loaded '${file}' successfully`);
      } catch (err) {
        BotConsole.error(`Error loading '${file}': ${err.message}`);
        throw err;
      }
    }

    this.store = newStore;
    this.emit("reload", { timestamp: new Date(), store: this.store });

    return this.store;
  }

  startAutoReload(intervalMs = 3600_000) {
    BotConsole.info("Starting auto-reload");
    if (this._reloadTimer) clearInterval(this._reloadTimer);

    const reload = async () => {
      try {
        await this.loadConfig();
        BotConsole.info(`Config reloaded at ${new Date().toISOString()}`);
      } catch (err) {
        BotConsole.error(`Auto-reload error: ${err.message}`);
      }
    };

    reload();
    this._reloadTimer = setInterval(reload, intervalMs);
    BotConsole.info("Auto-reload started");
  }

  stopAutoReload() {
    if (this._reloadTimer) {
      clearInterval(this._reloadTimer);
      this._reloadTimer = null;
      BotConsole.info("Auto-reload stopped");
      this.emit("stop");
    }
  }

  getConfig(path) {
    if (!path) throw new Error("Config path required");
    const [file, ...keys] = path.split(".");
    let result = this.store[file];
    if (result === undefined) {
      throw new Error(`Config file not found: ${file}`);
    }
    for (const key of keys) {
      if (result && key in result) {
        result = result[key];
      } else {
        throw new Error(`Key '${key}' not found in ${file}`);
      }
    }
    return result;
  }

  getAllConfig() {
    if (!Object.keys(this.store).length) {
      throw new Error("No config files loaded");
    }
    return { ...this.store };
  }
}

export default new ConfigManager();
