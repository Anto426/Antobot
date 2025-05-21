import fs from "fs";
import { Collection } from "discord.js";
import BotConsole from "../console/BotConsole.js";
import { pathToFileURL } from "url";
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
        BotConsole.error(`Failed to load file ${files[i]}:` + result.reason);
      });
    }

    BotConsole.success(
      `  Collection loaded with ${this.#collection.size} item(s).`
    );

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
      const fileUrl = pathToFileURL(filePath).href;
      const file = await import(fileUrl);
      const FileExport = file.default;

      if (!FileExport) {
        BotConsole.warning(
          `Skipping file ${filePath}: No default export found.`
        );
        return;
      }

      if (this.#isValidClass(FileExport)) {
        this.#collection.set(FileExport.name, FileExport);
        return;
      }

      if (this.#hasValidName(FileExport)) {
        this.#collection.set(FileExport.name, FileExport);
        return;
      }

      const fallbackName = this.#getFileNameFromPath(filePath);
      this.#collection.set(fallbackName, FileExport);
      BotConsole.warning(
        `Loaded file ${filePath} using fallback name "${fallbackName}"`
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  #isValidClass(thing) {
    return (
      typeof thing === "function" &&
      /^class\s/.test(Function.prototype.toString.call(thing)) &&
      typeof thing.name === "string" &&
      thing.name.trim().length > 0
    );
  }

  #hasValidName(thing) {
    return thing?.name && typeof thing.name === "string";
  }

  #getFileNameFromPath(filePath) {
    return filePath
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "");
  }
  #normalizePath(path) {
    return path.replace(/\\/g, "/");
  }

  getCollection() {
    return this.#collection;
  }
}

export default CreateCollection;
