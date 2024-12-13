import { ERROR_CODE } from "../error/ErrorHandler.js";
import JsonHandler from "../json/JsonHandler.js";

class SystemCheck {
  #config;
  #path;
  #json;

  constructor() {
    this.#config = {};
    this.#path = "./config/setting.json";
    this.#json = new JsonHandler();
  }

  async loadConfig() {
    try {
      this.#config = await this.#json.readFromFile(this.#path);
      return this.#config;
    } catch (error) {
      throw ERROR_CODE.core.initialization.system.config;
    }
  }

  getPath(pathType, subType, file = "") {
    try {
      const basePath = this.#config.paths?.[pathType]?.[subType];
      if (!basePath) {
        throw ERROR_CODE.system.path.resolution;
      }
      return file ? `${basePath}/${file}` : basePath;
    } catch (error) {
      throw ERROR_CODE.system.path.resolution;
    }
  }

  getDatabasePath(type, file = "") {
    try {
      const path = this.getPath("database", "files", type);
      if (!path && !this.#config.paths?.database?.root) {
        throw ERROR_CODE.core.initialization.system.database;
      }
      return file ? path : this.#config.paths.database.root + (path || "");
    } catch (error) {
      throw ERROR_CODE.core.initialization.system.database;
    }
  }

  getModulePath(module, type) {
    try {
      const modulePath = this.#config.paths?.modules?.[module];
      if (!modulePath?.[type]) {
        throw ERROR_CODE.services.moduleLoader.commands;
      }
      return modulePath[type];
    } catch (error) {
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  getAssetPath(category, type, filename) {
    try {
      const assetConfig = this.#config.paths?.assets?.[category];
      if (!assetConfig) {
        throw ERROR_CODE.system.path.resolution;
      }

      const typeConfig = assetConfig[type];
      if (!typeConfig) {
        throw ERROR_CODE.system.path.resolution;
      }

      if (filename && !typeConfig.files.includes(filename)) {
        throw ERROR_CODE.system.path.resolution;
      }
      
      return filename ? `${typeConfig.directory}/${filename}` : typeConfig.directory;
    } catch (error) {
      throw ERROR_CODE.system.path.resolution;
    }
  }

  isFeatureEnabled(feature) {
    try {
      if (feature === 'openai') {
        return this.#config.features?.openai?.enabled ?? false;
      }
      return Boolean(this.#config.features?.[feature]);
    } catch (error) {
      throw ERROR_CODE.system.error.handling;
    }
  }

  getGithubConfig(key = null) {
    try {
      const githubConfig = this.#config.remote?.github;
      if (!githubConfig) {
        throw ERROR_CODE.system.error.handling;
      }
      
      if (key) {
        return githubConfig[key] ?? null;
      }
      
      return githubConfig;
    } catch (error) {
      throw ERROR_CODE.system.error.handling;
    }
  }
}

export default new SystemCheck();
