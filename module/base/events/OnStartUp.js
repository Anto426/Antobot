import BotConsole from "../../../class/console/BotConsole.js";
import StartupLogger from "../../../class/console/LogStartup.js";
import CommandGuildUpdate from "../../../class/Guild/CommandGuildUpdate.js";
import IntitialOtherModules from "../../../class/Loader/IntitialOtherModules.js";
import SynchronizationManager from "../../../class/services/SynchronizationManager.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import SqlManager from "../../../class/services/SqlManager.js";
import SystemCheck from "../../../class/client/SystemCheck.js";
import { version as djsVersion } from "discord.js";

async function sendStartupNotification() {
  const targetGuilds = await SqlManager.getGuildsWithLogChannel();
  if (targetGuilds.length === 0) return;

  const botVersion = SystemCheck.getVersion() || "N/A";
  const serverCount = client.guilds.cache.size;
  const commandCount = client.commands.size;
  const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const nodeVersion = process.version;

  const embed = await new PresetEmbed({
    image: client.user.displayAvatarURL(),
  }).init();

  embed
    .setAuthor({
      name: `${client.user.username}`,
      iconURL: client.user.displayAvatarURL(),
    })
    .setTitle("✨ Sono di nuovo Online! ✨")
    .setDescription(
      "Ciao! Ho appena finito di svegliarmi e sono pronta a servire. Tutti i miei sistemi sono operativi!"
    )
    .setThumbnailclient()
    .addFields(
      {
        name: "📊 Statistiche",
        value: `> 🏠 Server: **${serverCount}**\n> 🤖 Comandi: **${commandCount}**`,
        inline: true,
      },
      {
        name: "⚙️ Sistema",
        value: `> 🧠 Memoria: **${memoryUsed} MB**\n> 🟩 Node.js: **${nodeVersion}**`,
        inline: true,
      },
      {
        name: "📚 Versioni",
        value: `> 🤖 Bot: **v${botVersion}**\n> 💬 Discord.js: **v${djsVersion}**`,
        inline: false,
      }
    )
    .setTimestamp()

  let sentCount = 0;
  for (const guildConfig of targetGuilds) {
    try {
      const channel = await client.channels.fetch(guildConfig.LOG_ID);
      if (channel?.isTextBased()) {
        await channel.send({ embeds: [embed] });
        sentCount++;
      }
    } catch (err) {
      BotConsole.error(
        `[StartupNotify] Impossibile inviare messaggio al canale ${guildConfig.LOG_ID}:`,
        err.message
      );
    }
  }

  if (sentCount > 0) {
    BotConsole.success(
      `[StartupNotify] Notifica di avvio inviata a ${sentCount} server.`
    );
  }
}

export default {
  name: "OnStartUp",
  eventType: "ready",
  isActive: true,
  async execute() {
    BotConsole.info("Avvio del bot in corso...");

    await CommandGuildUpdate.updateGuildsOnStartup();
    BotConsole.success("Comandi globali e di gilda aggiornati.");

    await SynchronizationManager.synchronizeAll();
    BotConsole.success("Sincronizzazione dati completata.");

    await IntitialOtherModules.Init();
    BotConsole.success("Moduli secondari inizializzati.");

    await StartupLogger.run();

    client.botready = true;
    BotConsole.success("Bot pronto all’uso!");

    await sendStartupNotification();
  },
};
