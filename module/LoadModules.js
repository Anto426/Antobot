class LoadEventsAndCommand {
  constructor() {
    this.botConsole = new BotConsole();
    this.check = new Check();
  }

  async load(collectionName, root) {
    if (!root) {
      throw ERROR_CODE.system.path.resolution;
    }

    try {
      const collection = await new CreateCollection().createCollection(
        root,
        ".js"
      );
      const color = collection.size > 0 ? "green" : "red";
      client[collectionName] = collection;
      this.botConsole.log(
        `Loaded ${collection.size} ${collectionName} files`,
        color
      );
    } catch (error) {
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  async loadModules() {
    try {
      const moduleLoaders = {
        base: {
          commands: () =>
            this.load(
              "basecommands",
              `${process.env.dirbot}${setting.base.commands}`
            ),
          events: () =>
            this.loadEvents(
              "baseevents",
              `${process.env.dirbot}${setting.base.events}`
            ),
          buttons: () =>
            this.load(
              "basebutton",
              `${process.env.dirbot}${setting.base.button}`
            ),
        },
        distube: {
          commands: () =>
            this.load(
              "distubecommands",
              `${process.env.dirbot}${setting.distube.commands}`
            ),
          events: () => this.loadDistubeEvents(),
          buttons: () =>
            this.load(
              "distubebutton",
              `${process.env.dirbot}${setting.distube.button}`
            ),
        },
      };

      await Promise.all(
        Object.values(moduleLoaders.base).map((loader) => loader())
      );

      if (await this.check.checkAllowDistube()) {
        await Promise.all(
          Object.values(moduleLoaders.distube).map((loader) => loader())
        );
      }
    } catch (error) {
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  async loadEvents(collection, path) {
    try {
      await this.load(collection, path);
      client[collection].forEach((event) => {
        if (event.allowevents) {
          client.on(event.typeEvent, (...args) => event.execute(...args));
        }
      });
    } catch (error) {
      throw ERROR_CODE.services.moduleLoader.events;
    }
  }

  async loadDistubeEvents() {
    try {
      await this.load(
        "distubeevents",
        `${process.env.dirbot}${setting.distube.events}`
      );
      client.distubeevents.forEach((event) => {
        if (event.allowevents) {
          distube.on(event.typeEvent, (...args) => event.execute(...args));
        }
      });
    } catch (error) {
      throw ERROR_CODE.modules.music.player;
    }
  }

  async createPrimaryCollection() {
    try {
      client.commandg = client.distubecommands
        ? new Collection([...client.basecommands, ...client.distubecommands])
        : client.basecommands;

      client.buttong = client.distubebutton
        ? new Collection([...client.basebutton, ...client.distubebutton])
        : client.basebutton;
    } catch (error) {
      throw ERROR_CODE.services.moduleLoader.commands;
    }
  }

  async loadall() {
    try {
      await this.loadModules();
      this.botConsole.log("All files loaded successfully", "green");

      await this.createPrimaryCollection();
      this.botConsole.log("Collections created successfully", "green");
    } catch (error) {
      this.botConsole.log(
        "Error loading modules and creating collections",
        "red"
      );
      throw ERROR_CODE.core.initialization.system.config;
    }
  }
}
