import SystemCheck from "../client/SystemCheck.js";
import CreateCollection from "./CreateCollection.js";
import BotConsole from "../console/BotConsole.js";
import { Collection } from "discord.js";

class LoadModules {
  #baseCommands = new Collection();
  #musicCommands = new Collection();
  #baseButtons = new Collection();
  #musicButtons = new Collection();
  #baseEvents = new Collection();
  #musicEvents = new Collection();
  #otherModules = new Collection();

  async #loadCollection(name, dir) {
    if (typeof name !== "string" || !name) {
      throw new TypeError("Invalid collection name");
    }
    if (typeof dir !== "string" || !dir) {
      throw new TypeError("Invalid path for " + name);
    }

    try {
      const col = await new CreateCollection().createCollection(dir, ".js");
      if (!(col instanceof Collection)) {
        throw new Error("Not a Collection");
      }

      for (const [key, item] of col.entries()) {
        if (typeof item === "object" && item !== null) {
          item.moduleTag = name;
        }
      }

      return col;
    } catch (err) {
      throw new Error(`Failed to load ${name}: ${err.message}`);
    }
  }

  async #loadEvents(name, dir, emitter) {
    const col = await this.#loadCollection(name, dir);
    for (const evt of col.values()) {
      if (evt.isActive) {
        emitter.on(evt.eventType, (...args) => evt.execute(...args));
      }
    }
    return col;
  }

  async #batchLoad(category, tasks = []) {
    const runners = tasks.map(({ type, name, group, emitter }) => {
      const dir = SystemCheck.getModulePath(group, type);
      return type === "events"
        ? this.#loadEvents(name, dir, emitter)
        : this.#loadCollection(name, dir);
    });

    const results = await Promise.all(runners);
    BotConsole.success(`${category} modules loaded`);
    return results;
  }

  async initialize() {
    [this.#baseCommands, this.#baseEvents, this.#baseButtons] =
      await this.#batchLoad("Base", [
        {
          type: "commands",
          name: "baseCommands",
          group: "base",
          emitter: client,
        },
        {
          type: "events",
          name: "baseEvents",
          group: "base",
          emitter: client,
        },
        {
          type: "buttons",
          name: "baseButtons",
          group: "base",
          emitter: client,
        },
      ]);

    if (SystemCheck.isFeatureEnabled("music")) {
      [this.#musicCommands, this.#musicEvents, this.#musicButtons] =
        await this.#batchLoad("Music", [
          {
            type: "commands",
            name: "musicCommands",
            group: "distube",
            emitter: client,
          },
          {
            type: "events",
            name: "musicEvents",
            group: "distube",
            emitter: global.distube,
          },
          {
            type: "buttons",
            name: "musicButtons",
            group: "distube",
            emitter: client,
          },
        ]);
    }

    this.#otherModules = await this.#loadCollection(
      "otherModules",
      SystemCheck.getModulePath("other", "root")
    );
    BotConsole.success("Other modules loaded");

    client.commands = new Collection([
      ...this.#baseCommands,
      ...(this.#musicCommands || []),
    ]);
    client.buttons = new Collection([
      ...this.#baseButtons,
      ...(this.#musicButtons || []),
    ]);
    client.events = new Collection([
      ...this.#baseEvents,
      ...(this.#musicEvents || []),
    ]);
    client.other = new Collection([...this.#otherModules]);

    BotConsole.debug(
      `Commands: ${client.commands.size} | Buttons: ${client.buttons.size}`,
      {
        type: "debug",
        data: {
          commands: client.commands.size,
          buttons: client.buttons.size,
          timestamp: new Date().toISOString(),
        },
      }
    );

    BotConsole.success("All modules loaded successfully");
    BotConsole.info(
      "Temporary collections are kept private and not attached to client"
    );
  }
}

export default LoadModules;
