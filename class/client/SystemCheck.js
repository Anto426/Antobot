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
      this.#validateConfig();
      return this.#config;
    } catch (error) {
      throw ERROR_CODE.core.initialization.system.config;
    }
  }

  #validateConfig() {
    const requiredPaths = ["paths", "features", "remote"];
    const missing = requiredPaths.filter((path) => !this.#config[path]);
    if (missing.length) {
      throw ERROR_CODE.core.initialization.system.config;
    }
  }

  #resolvePath(...pathSegments) {
    let current = this.#config;
    for (const segment of pathSegments) {
      current = current?.[segment];
      if (current === undefined) {
        throw ERROR_CODE.system.path.resolution;
      }
    }
    return current;
  }

  getPath(pathType, subType, file = "") {
    try {
      const basePath = this.#resolvePath("paths", pathType, subType);
      return file ? `${basePath}/${file}` : basePath;
    } catch {
      throw ERROR_CODE.system.path.resolution;
    }
  }

  getDatabasePath(type, file = "") {
    try {
      const root = this.#resolvePath("paths", "database", "root");
      const filePath = type
        ? this.#resolvePath("paths", "database", "files", type)
        : "";
      return file ? filePath : `${root}${filePath}`;
    } catch {
      throw ERROR_CODE.core.initialization.system.database;
    }
  }

  getModulePath(module, type) {
    try {
      return this.#resolvePath("paths", "modules", module, type);
    } catch {
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  getAssetPath(category, type, filename = "") {
    try {
      const typeConfig = this.#resolvePath("paths", "assets", category, type);

      if (filename) {
        if (!typeConfig.files?.includes(filename)) {
          throw ERROR_CODE.system.path.resolution;
        }
        return `${typeConfig.directory}/${filename}`;
      }

      return typeConfig.directory;
    } catch {
      throw ERROR_CODE.system.path.resolution;
    }
  }

  isFeatureEnabled(feature) {
    try {
      if (feature === "openai") {
        return this.#resolvePath("features", "openai", "enabled");
      }
      return Boolean(this.#resolvePath("features", feature));
    } catch {
      return false;
    }
  }

  getGithubConfig(key = null) {
    try {
      const githubConfig = this.#resolvePath("remote", "github");
      return key ? githubConfig[key] : githubConfig;
    } catch {
      throw ERROR_CODE.system.error.handling;
    }
  }
}

export default new SystemCheck();
