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
  const commandCount = client.commands.size;
  const uptimeFormatted = new Date(process.uptime() * 1000)
    .toISOString()
    .substr(11, 8);
  const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

  const embed = await new PresetEmbed({
    image: client.user.displayAvatarURL(),
  }).init();

  embed
    .setAuthor({
      name: `${client.user.username} è Online`,
      iconURL: "https://i.imgur.com/B6f5s2s.gif",
    })  
    .setTitle("✅ Avvio del Sistema Completato")
    .setDescription(
      `Il bot è stato avviato o riavviato con successo ed è ora pienamente operativo.`
    )
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
      {
        name: "Stato Operativo",
        value: `\`\`\`ini\n[ Versione = ${botVersion} ]\n[ Comandi  = ${commandCount} ]\n[ Server   = ${serverCount} ]\`\`\``,
        inline: false,
      },
      {
        name: "Risorse di Sistema",
        value: `\`\`\`prolog\nUptime: ${uptimeFormatted}\nMemoria: ${memoryUsed} MB\`\`\``,
        inline: false,
      }
    )
    .setTimestamp()
    .setFooter({ text: "Bot Operativo" });

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
