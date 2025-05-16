import fs from "fs";
import { Collection } from "discord.js";
import BotConsole from "../console/BotConsole.js";
class CreateCollection {
  #collection;

  constructor() {
    this.#collection = new Collection();
  }

  async createCollection(root, extension) {
    if (!root || !extension) {
      BotConsole.warning(
        "Invalid root or extension provided. Returning empty collection."
      );
      return this.#collection;
    }

    const normalizedRoot = this.#normalizePath(root);
    if (!fs.existsSync(normalizedRoot)) {
      BotConsole.info(
        `Directory "${normalizedRoot}" does not exist. Returning empty collection.`
      );
      return this.#collection;
    }

    const files = this.getFilesRecursively(normalizedRoot, extension);
    if (files.length === 0) {
      BotConsole.info(
        `No "${extension}" files found in "${normalizedRoot}". Returning empty collection.`
      );
      return this.#collection;
    }

    const loadResults = await Promise.allSettled(
      files.map((file) => this.loadFile(file))
    );

    const failures = loadResults.filter(
      (result) => result.status === "rejected"
    );
    if (failures.length > 0) {
      failures.forEach((result, i) => {
        BotConsole.error(`Failed to load file ${files[i]}:`, result.reason);
      });
    }

    BotConsole.info(`Collection loaded with ${this.#collection.size} item(s).`);
    return this.#collection;
  }

  getFilesRecursively(dir, extension) {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .reduce((files, item) => {
        const path = this.#normalizePath(`${dir}/${item.name}`);
        if (item.isDirectory()) {
          return [...files, ...this.getFilesRecursively(path, extension)];
        }
        return item.isFile() &&
          item.name.toLowerCase().endsWith(extension.toLowerCase())
          ? [...files, path]
          : files;
      }, []);
  }

  async loadFile(filePath) {
    try {
      const fileUrl = new URL("./../../" + filePath, import.meta.url).href;
      const file = await import(fileUrl);

      if (!this.#validateFile(file.default)) {
        BotConsole.warning(
          `Skipping invalid file ${filePath}: Missing or invalid name property`
        );
        return;
      }

      this.#collection.set(file.default.name, file.default);
    } catch (err) {
      BotConsole.error(`Failed to load file ${filePath}:`);
    }
  }

  #validateFile(file) {
    return file?.name && typeof file.name === "string";
  }

  #normalizePath(path) {
    return path.replace(/\\/g, "/");
  }

  getCollection() {
    return this.#collection;
  }
}

export default CreateCollection;
