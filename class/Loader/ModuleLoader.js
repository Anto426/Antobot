import BotConsole from "../console/BotConsole.js";
import SystemCheck from "../client/SystemCheck.js";
import { Collection } from "discord.js";
import CreateCollection from "./CreateCollection.js";

class LoadModules {
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

      client[name] = col;

      const size = col.size;
      const status = size ? "success" : "warning";
      BotConsole[status](
        `${name}: loaded ${size} ${size === 1 ? "file" : "files"} from ${dir}`,
        {
          type: status,
          data: { name, size, dir, timestamp: new Date().toISOString() },
        }
      );

      return col;
    } catch (err) {
      BotConsole.error(`Failed to load ${name}: ${err.message}`);
      throw new Error(`✖ Failed to load ${name}: ${err.message}`);
    }
  }

  async #loadEvents(name, dir, emitter) {
    const col = await this.#loadCollection(name, dir);
    for (const evt of col.values()) {
      if (evt.allowevents) {
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
    await this.#batchLoad("Base", [
      {
        type: "commands",
        name: "basecommands",
        group: "base",
        emitter: client,
      },
      {
        type: "events",
        name: "baseevents",
        group: "base",
        emitter: client,
      },
      {
        type: "buttons",
        name: "basebutton",
        group: "base",
        emitter: client,
      },
    ]);

    if (SystemCheck.isFeatureEnabled("music")) {
      await this.#batchLoad("Music", [
        {
          type: "commands",
          name: "musiccommands",
          group: "distube",
          emitter: client,
        },
        {
          type: "events",
          name: "musicevents",
          group: "distube",
          emitter: global.distube,
        },
        {
          type: "buttons",
          name: "musicbutton",
          group: "distube",
          emitter: client,
        },
      ]);
    }

    await this.#loadCollection(
      "other",
      SystemCheck.getModulePath("other", "root")
    );
    BotConsole.success("Other modules loaded");

    client.commands = new Collection([
      ...client.basecommands,
      ...(client.musiccommands || []),
    ]);
    client.buttons = new Collection([
      ...client.basebutton,
      ...(client.musicbutton || []),
    ]);

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
    BotConsole.info("Clear unused collections");
    for (const key of Object.keys(client)) {
      if (
        ["basecommands", "musiccommands", "basebutton", "musicbutton"].includes(
          key
        )
      ) {
        delete client[key];
      }
    }
    BotConsole.success("Unused collections cleared");
  }
}

export default LoadModules;
