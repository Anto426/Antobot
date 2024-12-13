import { ERROR_CODE } from "../error/ErrorHandler.js";
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
    if (!path) {
      throw ERROR_CODE.system.path.resolution;
    }

    try {
      const collection = await new CreateCollection().createCollection(path, ".js");
      client[collectionName] = collection;
      
      BotConsole.log({
        message: `Loaded ${collection.size} ${collectionName} files`,
        type: collection.size > 0 ? 'success' : 'error'
      });

      return collection;
    } catch (error) {
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  async #loadEvents(collection, path, eventEmitter = client, eventType = 'typeEvent') {
    try {
      await this.#loadCollection(collection, path);
      
      client[collection].forEach(event => {
        if (event.allowevents) {
          eventEmitter.on(event[eventType], (...args) => event.execute(...args));
        }
      });
    } catch (error) {
      throw ERROR_CODE.services.moduleLoader.events;
    }
  }

  async loadBaseModules() {
    try {
      await Promise.all([
        this.#loadCollection('basecommands', this.#systemCheck.getModulePath('base', 'commands')),
        this.#loadEvents('baseevents', this.#systemCheck.getModulePath('base', 'events')),
        this.#loadCollection('basebutton', this.#systemCheck.getModulePath('base', 'buttons'))
      ]);
    } catch (error) {
      BotConsole.error('Failed to load base modules:', error);
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  async loadMusicModules() {
    if (!this.#systemCheck.isFeatureEnabled('music')) {
      return;
    }

    try {
      await Promise.all([
        this.#loadCollection('musiccommands', this.#systemCheck.getModulePath('music', 'commands')),
        this.#loadEvents('musicevents', this.#systemCheck.getModulePath('music', 'events'), distube),
        this.#loadCollection('musicbutton', this.#systemCheck.getModulePath('music', 'buttons'))
      ]);
    } catch (error) {
      BotConsole.error('Failed to load music modules:', error);
      throw ERROR_CODE.modules.music.player;
    }
  }

  async createGlobalCollections() {
    try {
      // Create global command collection
      client.commands = new Collection([
        ...client.basecommands,
        ...(client.musiccommands || [])
      ]);

      // Create global button collection
      client.buttons = new Collection([
        ...client.basebutton,
        ...(client.musicbutton || [])
      ]);

      BotConsole.success('Global collections created successfully');
    } catch (error) {
      BotConsole.error('Failed to create global collections:', error);
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  async initialize() {
    try {
      await this.loadBaseModules();
      await this.loadMusicModules();
      await this.createGlobalCollections();
      
      BotConsole.success('All modules loaded successfully');
    } catch (error) {
      BotConsole.error('Failed to initialize modules:', error);
      throw ERROR_CODE.core.initialization.system.config;
    }
  }
}

export default LoadModules;
