import { ERROR_CODE } from "../error/ErrorHandler.js";
import JsonHandler from "../json/JsonHandler.js";
class SystemCheck {
  #config;
  #systemInfo;
  #jsonHandler;

  static #REQUIRED_CONFIG_SECTIONS = ["paths", "features", "remote"];
  static #CONFIG_PATH = "./config/setting.json";
  static #SYSTEM_INFO_PATH = "./package.json";

  constructor() {
    this.#config = {};
    this.#systemInfo = {};
    this.#jsonHandler = new JsonHandler();
  }

  async initialize() {
    try {
      [this.#config, this.#systemInfo] = await Promise.all([
        this.#jsonHandler.readFromFile(SystemCheck.#CONFIG_PATH),
        this.#jsonHandler.readFromFile(SystemCheck.#SYSTEM_INFO_PATH),
      ]);

      this.#validateConfig();
      return true;
    } catch (error) {
      console.error("Initialization failed:", error);
      throw ERROR_CODE.core.initialization.system.config;
    }
  }

  #validateConfig() {
    if (
      !this.#config ||
      typeof this.#config !== "object" ||
      Array.isArray(this.#config)
    ) {
      throw ERROR_CODE.core.initialization.system.config;
    }

    const missingSections = SystemCheck.#REQUIRED_CONFIG_SECTIONS.filter(
      (section) => !(section in this.#config)
    );

    if (missingSections.length) {
      throw new Error(
        `Missing required config sections: ${missingSections.join(", ")}`
      );
    }
  }

  #resolvePath(path) {
    if (!Array.isArray(path)) {
      throw new Error("Path must be an array");
    }

    return path.reduce((obj, key) => {
      if (obj === null || obj === undefined || !(key in obj)) {
        throw ERROR_CODE.system.path.resolution;
      }
      return obj[key];
    }, this.#config);
  }

  getResourcePath(category, subcategory, filename = "") {
    if (!category || !subcategory) {
      throw new Error("Category and subcategory are required");
    }

    try {
      const basePath = this.#resolvePath(["paths", category, subcategory]);
      return filename ? `${basePath}/${filename}` : basePath;
    } catch (error) {
      console.error("Resource path resolution failed:", error);
      throw ERROR_CODE.system.path.resolution;
    }
  }

  getDatabasePath(category, filename = "") {
    try {
      const rootPath = this.#resolvePath(["paths", "database", "root"]);
      if (!category) return rootPath;

      const filePath = this.#resolvePath([
        "paths",
        "database",
        "files",
        category,
      ]);
      return filename ? filePath : `${rootPath}${filePath}`;
    } catch (error) {
      console.error("Database path resolution failed:", error);
      throw ERROR_CODE.core.initialization.system.database;
    }
  }

  getModulePath(moduleName, type) {
    if (!moduleName || !type) {
      throw new Error("Module name and type are required");
    }

    try {
      const root = this.#resolvePath(["paths", "modules", "root"]);
      const modulePath = this.#resolvePath([
        "paths",
        "modules",
        moduleName,
        type,
      ]);
      return `${root}${modulePath}`;
    } catch (error) {
      console.error("Module path resolution failed:", error);
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  getAssetPath(category, type, filename = "") {
    if (!category || !type) {
      throw new Error("Category and type are required");
    }

    try {
      const assetConfig = this.#resolvePath([
        "paths",
        "assets",
        category,
        type,
      ]);

      if (filename) {
        if (
          !Array.isArray(assetConfig.files) ||
          !assetConfig.files.includes(filename)
        ) {
          throw ERROR_CODE.system.path.resolution;
        }
        return `${assetConfig.directory}/${filename}`;
      }

      return assetConfig.directory;
    } catch (error) {
      console.error("Asset path resolution failed:", error);
      throw ERROR_CODE.system.path.resolution;
    }
  }

  isFeatureEnabled(featureName) {
    if (!featureName) return false;

    try {
      return featureName === "openai"
        ? this.#resolvePath(["features", "openai", "enabled"])
        : Boolean(this.#resolvePath(["features", featureName]));
    } catch {
      return false;
    }
  }

  getOpenAIModel() {
    try {
      return this.#resolvePath(["features", "openai", "model"]);
    } catch (error) {
      console.error("OpenAI model resolution failed:", error);
      throw ERROR_CODE.system.path.resolution;
    }
  }

  getGithubConfig(key) {
    try {
      const githubConfig = this.#resolvePath(["remote", "github"]);
      return key ? githubConfig[key] : githubConfig;
    } catch (error) {
      console.error("GitHub config resolution failed:", error);
      throw ERROR_CODE.system.error.handling;
    }
  }

  getSystemInfo(key) {
    if (!this.#systemInfo || typeof this.#systemInfo !== "object") {
      throw ERROR_CODE.system.error.handling;
    }
    return key ? this.#systemInfo[key] : this.#systemInfo;
  }

  getVersion = () => this.getSystemInfo("version");
  getName = () => this.getSystemInfo("name");
  getAuthor = () => this.getSystemInfo("author");
  getRepo = () => this.getSystemInfo("repo");
  getDependencies = () => this.getSystemInfo("dependencies");
}

export default new SystemCheck();
