import JsonHandler from "../Json/JsonHandler.js";

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
      throw new Error("Failed to initialize system check", error);
    }
  }

  getConfigProperty(...path) {
    try {
      // Questo metodo riutilizza il tuo robusto helper privato #resolvePath
      return this.#resolvePath(path);
    } catch (error) {
      // In caso di errore (percorso non trovato), ritorna null invece di crashare.
      return null;
    }
  }

  #validateConfig() {
    if (
      !this.#config ||
      typeof this.#config !== "object" ||
      Array.isArray(this.#config)
    ) {
      throw new Error("Invalid config object");
    }

    const missingSections = SystemCheck.#REQUIRED_CONFIG_SECTIONS.filter(
      (section) => !(section in this.#config)
    );

    if (missingSections.length) {
      throw new Error(`Missing config sections: ${missingSections.join(", ")}`);
    }
  }

  #resolvePath(path) {
    if (!Array.isArray(path)) {
      throw new Error("Invalid path array");
    }

    return path.reduce((obj, key) => {
      if (obj === null || obj === undefined || !(key in obj)) {
        throw new Error("Invalid path resolution");
      }
      return obj[key];
    }, this.#config);
  }

  getResourcePath(category, subcategory, filename = "") {
    if (!category || !subcategory) {
      throw new Error("Invalid category or subcategory");
    }

    try {
      const basePath = this.#resolvePath(["paths", category, subcategory]);
      return filename ? `${basePath}/${filename}` : basePath;
    } catch (error) {
      throw new Error("Failed to resolve resource path", error);
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
      throw new Error("Failed to resolve database path", error);
    }
  }

  getModulePath(moduleName, type) {
    if (!moduleName || !type) {
      throw new Error("Invalid module name or type");
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
      throw new Error("Failed to resolve module path", error);
    }
  }

  getAssetPath(category, type, filename = "") {
    if (!category || !type) {
      throw new Error("Invalid category or type");
    }

    const assetConfig = this.#resolvePath(["paths", "assets", category, type]);

    if (filename) {
      if (
        !Array.isArray(assetConfig.files) ||
        !assetConfig.files.includes(filename)
      ) {
        throw new Error("Invalid asset filename");
      }
      return `${assetConfig.directory}/${filename}`;
    }

    return assetConfig.directory;
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
    return this.#resolvePath(["features", "openai", "model"]);
  }

  getFeatures() {
    const features = this.#resolvePath(["features"]);
    return Object.entries(features).map(([key, value]) => {
      if (typeof value === "boolean") {
        return { name: key, enabled: value, details: "" };
      }
      return {
        name: key,
        enabled: Boolean(value.enabled),
      };
    });
  }

  getGithubConfig(key) {
    const githubConfig = this.#resolvePath(["remote", "github"]);
    return key ? githubConfig[key] : githubConfig;
  }

  getSystemInfo(key) {
    if (!this.#systemInfo || typeof this.#systemInfo !== "object") {
      throw new Error("Invalid system info object");
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
