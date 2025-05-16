import BotConsole from "./../console/BotConsole.js";
import SystemCheck from "./../client/SystemCheck.js";
import { Collection } from "discord.js";
import CreateCollection from "./CreateCollection.js";

class LoadModules {
  #systemCheck;

  constructor() {
    this.#systemCheck = SystemCheck;
  }

  async #loadCollection(collectionName, path) {
    if (!collectionName || typeof collectionName !== "string") {
      throw new Error("Invalid collection name provided");
    }

    if (!path || typeof path !== "string") {
      throw new Error("Invalid path provided");
    }

    try {
      const collection = await new CreateCollection().createCollection(
        path,
        ".js"
      );

      if (!collection || !(collection instanceof Collection)) {
        throw new Error("Failed to load collection");
      }

      client[collectionName] = collection;

      const size = collection.size;
      const logStatus = size > 0 ? "success" : "warning";
      const message = `${collectionName}: Loaded ${size} ${
        size === 1 ? "file" : "files"
      } from ${path}`;
      const logData = {
        type: logStatus,
        data: {
          collectionName,
          size,
          path,
          timestamp: new Date().toISOString(),
        },
      };

      BotConsole[logStatus](message, logData);

      return collection;
    } catch (error) {
      throw new Error(`Failed to load ${collectionName}` + error);
    }
  }

  async #loadEvents(collection, path) {
    await this.#loadCollection(collection, path);
    client[collection].forEach((event) => {
      if (event.allowevents) {
        client.on(event.eventType, (...args) => event.execute(...args));
      }
    });
  }

  async loadBaseModules() {
    let result = await Promise.all([
      await this.#loadCollection(
        "basecommands",
        this.#systemCheck.getModulePath("base", "commands")
      ),
      await this.#loadEvents(
        "baseevents",
        this.#systemCheck.getModulePath("base", "events")
      ),
      await this.#loadCollection(
        "basebutton",
        this.#systemCheck.getModulePath("base", "buttons")
      ),
    ]);

    BotConsole.success("Base modules loaded successfully");
    return result;
  }

  async loadMusicModules() {
    if (!this.#systemCheck.isFeatureEnabled("music")) {
      return;
    }

    let result = await Promise.all([
      await this.#loadCollection(
        "musiccommands",
        this.#systemCheck.getModulePath("distube", "commands")
      ),
      await this.#loadEvents(
        "musicevents",
        this.#systemCheck.getModulePath("distube", "events"),
        distube
      ),
      await this.#loadCollection(
        "musicbutton",
        this.#systemCheck.getModulePath("distube", "buttons")
      ),
    ]);

    return result;
  }

  async loadOtherModules() {
    let result = await this.#loadCollection(
      "other",
      this.#systemCheck.getModulePath("other", "root")
    );

    BotConsole.success("Base modules loaded successfully");
    return result;
  }

  async createGlobalCollections() {
    try {
      client.commands = new Collection([
        ...client.basecommands,
        ...(client.musiccommands || []),
      ]);

      client.buttons = new Collection([
        ...client.basebutton,
        ...(client.musicbutton || []),
      ]);

      BotConsole.success("Global collections created successfully");
    } catch (error) {
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  async initialize() {
    await this.loadBaseModules();
    await this.loadMusicModules();
    await this.createGlobalCollections();
    await this.loadOtherModules();
  }
}

export default new LoadModules();
