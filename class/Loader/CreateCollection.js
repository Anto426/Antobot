import fs from "fs/promises";
import path from "path";
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
        "Invalid root or extension. Returning empty collection."
      );
      return new Collection();
    }

    const normalizedRoot = this.#normalizePath(root);

    try {
      await fs.access(normalizedRoot);
    } catch {
      BotConsole.info(
        `Directory "${normalizedRoot}" non esiste. Restituita collezione vuota.`
      );
      return new Collection();
    }

    const files = await this.#getFilesRecursivelyAsync(
      normalizedRoot,
      extension
    );

    if (files.length === 0) {
      BotConsole.info(
        `Nessun file "${extension}" trovato in "${normalizedRoot}".`
      );
      return this.#collection;
    }

    this.#collection = new Collection();

    const loadResults = await Promise.allSettled(
      files.map((file) => this.loadFile(file))
    );

    const failures = loadResults.filter(
      (result) => result.status === "rejected"
    );

    if (failures.length > 0) {
      failures.forEach((result) => {
        BotConsole.error(`Fallito caricamento di un file:`, result.reason);
      });
    }

    BotConsole.success(
      `   Collezione caricata con ${this.#collection.size} item(s).`
    );
    return this.#collection;
  }

  async #getFilesRecursivelyAsync(dir, extension) {
    try {
      const dirents = await fs.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(
        dirents.map(async (dirent) => {
          const res = path.resolve(dir, dirent.name);
          const normalizedRes = this.#normalizePath(res);
          if (dirent.isDirectory()) {
            return this.#getFilesRecursivelyAsync(normalizedRes, extension);
          }
          return normalizedRes.toLowerCase().endsWith(extension.toLowerCase())
            ? normalizedRes
            : null;
        })
      );
      return Array.prototype.concat(...files).filter(Boolean);
    } catch (error) {
      BotConsole.error(`Errore leggendo la directory ${dir}`, error);
      return [];
    }
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

      if (this.#isValidClass(FileExport) || this.#hasValidName(FileExport)) {
        this.#collection.set(FileExport.name, FileExport);
      } else {
        const fallbackName = this.#getFileNameFromPath(filePath);
        this.#collection.set(fallbackName, FileExport);
        BotConsole.warning(
          `Loaded file ${filePath} using fallback name "${fallbackName}"`
        );
      }
    } catch (err) {
      throw new Error(`Errore importando ${filePath}: ${err.message}`);
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
    return path.basename(filePath, path.extname(filePath));
  }

  #normalizePath(filePath) {
    return filePath.replace(/\\/g, "/");
  }

  getCollection() {
    return this.#collection;
  }
}

export default CreateCollection;
