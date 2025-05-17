import BotConsole from "../console/BotConsole.js";

class CommandGuildUpdate {
  async deleteCommandsFromGuild(guild) {
    BotConsole.info(`Eliminazione comandi da ${guild.name}`);
    const existing = await guild.commands.fetch();

    if (existing.size === 0) {
      BotConsole.warning(`Nessun comando presente in ${guild.name}`);
      return 0;
    }

    const results = await Promise.allSettled(
      existing.map(cmd => cmd.delete())
    );

    const successCount = results.filter(r => r.status === "fulfilled").length;
    const failedCount = existing.size - successCount;

    if (failedCount === 0) {
      BotConsole.success(`Tutti i comandi eliminati da ${guild.name}`);
      return 0;
    }

    BotConsole[successCount > 0 ? "warning" : "error"](
      `Eliminati solo ${successCount}/${existing.size} comandi da ${guild.name}`
    );

    return successCount > 0 ? 0 : -1;
  }

  async registerCommandsToGuild(guild) {
    const result = await this.deleteCommandsFromGuild(guild);
    if (result < 0) return -1;

    BotConsole.info(`Registrazione comandi in ${guild.name}`);

    const commands = Array.from(client.commands.values());

    const results = await Promise.allSettled(
      commands.map(cmd => {
        if (!cmd.data) {
          BotConsole.error(`Comando senza struttura: ${cmd.name}`);
          return Promise.resolve(null);
        }

        return guild.commands.create(cmd.data).catch(err => {
          BotConsole.error(`Errore nella registrazione di ${cmd.name} in ${guild.name}`);
          console.error(err);
        });
      })
    );

    const successCount = results.filter(r => r.status === "fulfilled").length;
    const failedCount = commands.length - successCount;

    if (failedCount === 0) {
      BotConsole.success(`Comandi registrati in ${guild.name}`);
      return 0;
    }

    BotConsole[successCount > 0 ? "warning" : "error"](
      `${failedCount} errori nella registrazione in ${guild.name}`
    );

    return successCount > 0 ? 0 : -1;
  }

  async updateAllGuilds() {
    const guilds = Array.from(client.guilds.cache.values());

    const results = await Promise.allSettled(
      guilds.map(guild => this.registerCommandsToGuild(guild))
    );

    const successCount = results.filter(r => r.status === "fulfilled" && r.value === 0).length;
    const failedCount = guilds.length - successCount;

    if (failedCount === 0) {
      BotConsole.success("Comandi aggiornati in tutte le gilde");
      return 0;
    }

    BotConsole[successCount > 0 ? "warning" : "error"](
      `Aggiornamento fallito in ${failedCount} gilde`
    );

    return successCount > 0 ? 0 : -1;
  }

  async updateGuildsOnStartup() {
    if (!client.commands?.size) {
      BotConsole.error("Nessun comando da registrare");
      return 0;
    }

    const tasks = [];

    for (const guild of client.guilds.cache.values()) {
      const existing = await guild.commands.fetch();

      let needsUpdate = existing.size !== client.commands.size;

      if (!needsUpdate) {
        for (const cmd of client.commands.values()) {
          const match = existing.find(
            rc =>
              rc.name === cmd.data.name &&
              JSON.stringify(rc.toJSON()) === JSON.stringify(cmd.data)
          );

          if (!match) {
            needsUpdate = true;
            break;
          }
        }
      }

      if (needsUpdate) {
        tasks.push(this.registerCommandsToGuild(guild));
      } else {
        BotConsole.info(`${guild.name}: già aggiornato`);
      }
    }

    if (tasks.length === 0) {
      BotConsole.info("Tutte le gilde sono già aggiornate");
      return 0;
    }

    const results = await Promise.allSettled(tasks);
    const successCount = results.filter(r => r.status === "fulfilled" && r.value === 0).length;

    if (successCount === tasks.length) {
      BotConsole.success("Avvio: comandi aggiornati in tutte le gilde");
    } else {
      BotConsole.warning(`Avvio: ${tasks.length - successCount} gilde non aggiornate`);
    }

    return 0;
  }
}

export default new CommandGuildUpdate();
