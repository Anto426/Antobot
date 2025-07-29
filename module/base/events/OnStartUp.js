import BotConsole from "../../../class/console/BotConsole.js";
import ModuleLoader from "../../../class/Loader/ModuleLoader.js";
import StartupLogger from "../../../class/console/LogStartup.js";
import CommandGuildUpdate from "../../../class/Guild/CommandGuildUpdate.js";
import IntitialOtherModules from "../../../class/Loader/IntitialOtherModules.js";
import SynchronizationManager from "../../../class/services/SynchronizationManager.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import SqlManager from "../../../class/services/SqlManager.js";
import SystemCheck from "../../../class/client/SystemCheck.js";

async function sendStartupNotification() {
  const targetGuilds = await SqlManager.getGuildsWithLogChannel();
  if (targetGuilds.length === 0) return;

  const botVersion = SystemCheck.getVersion() || "N/A";
  const serverCount = client.guilds.cache.size;

  const embed = await new PresetEmbed({
    image: client.user.displayAvatarURL(),
  }).init();
  embed
    .setTitle("✅ Avvio Completato")
    .setDescription(`**${client.user.username}** è ora online e operativo!`)
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
      { name: "Versione", value: `\`${botVersion}\``, inline: true },
      { name: "Server Connessi", value: `\`${serverCount}\``, inline: true }
    )
    .setTimestamp();

  for (const guildConfig of targetGuilds) {
    try {
      const channel = await client.channels.fetch(guildConfig.LOG_ID);
      if (channel?.isTextBased()) {
        await channel.send({ embeds: [embed] });
      }
    } catch (err) {
      BotConsole.error(
        `[StartupNotify] Impossibile inviare messaggio al canale ${guildConfig.LOG_ID}:`,
        err.message
      );
    }
  }
  BotConsole.success(
    `[StartupNotify] Notifica di avvio inviata a ${targetGuilds.length} server.`
  );
}

export default {
  name: "OnStartUp",
  eventType: "ready",
  isActive: true,
  async execute() {
    await ModuleLoader.initAll?.();
    BotConsole.success("Tutti i moduli sono stati caricati correttamente.");

    await CommandGuildUpdate.updateGuildsOnStartup();
    BotConsole.success("Tutte le gilde sono state aggiornate con i comandi.");

    await SynchronizationManager.synchronizeAll();
    BotConsole.success("Tutte le gilde sono state sincronizzate.");

    await IntitialOtherModules.Init();
    BotConsole.success("Tutti i moduli secondari sono stati inizializzati.");

    await StartupLogger.run();

    client.botready = true;
    BotConsole.success("Bot pronto all’uso!");

    await sendStartupNotification();
  },
};
