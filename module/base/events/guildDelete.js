import BotConsole from "../../../class/console/BotConsole.js";
import SqlManager from "../../../class/Sql/SqlManager.js";

export default {
  name: "BotRemovedFromGuild",
  eventType: "guildDelete",
  isActive: true,

  async execute(guild) {
    try {
      BotConsole.warning(`Sono stato rimosso dal server: "${guild.name}"`, {
        ID: guild.id,
      });

      BotConsole.info(`Interruzione dei processi in memoria per la gilda: ${guild.name}`);
      
      const holidayModule = guild.client.modules?.get('Holiday');

      if (holidayModule) {
        holidayModule.stopGuildTracking(guild.id);
        BotConsole.info(`Processo "Holiday" per la gilda ${guild.name} interrotto.`);
      } else {
        BotConsole.warning(`Modulo "Holiday" non trovato o non inizializzato, pulizia memoria saltata.`);
      }
      
      BotConsole.info(`Inizio rimozione dati dal database per la gilda con ID: ${guild.id}...`);

      const deleteResult = await SqlManager.deleteGuild(guild.id);
      
      if (deleteResult.affectedRows > 0) {
        BotConsole.success(`Dati per la gilda "${guild.name}" e info collegate rimossi con successo dal DB.`);
      } else {
        BotConsole.info(`Nessun dato da rimuovere per la gilda "${guild.name}".`);
      }

    } catch (error) {
      BotConsole.error(`Errore durante l'evento guildDelete per la gilda con ID: ${guild.id}.`, error);
    }
  },
};