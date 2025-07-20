import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import { version as discordJsVersion } from "discord.js";
import { version as nodeVersion } from "process";
import SystemCheck from "../../../../class/client/SystemCheck.js";
import Time from "../../../../class/services/time.js";

export default {
  name: "info",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "info",
    description: "Mostra informazioni generali sul bot",
  },
  execute: async (interaction) => {
    const client = interaction.client;

    const uptimeMs = process.uptime() * 1000;
    const uptimeFormatted = new Time().formatDuration(uptimeMs);

    const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2
    );

    const botVersion =
      typeof SystemCheck.getVersion === "function"
        ? SystemCheck.getVersion()
        : "N/A";
    const repoLink =
      typeof SystemCheck.getRepo === "function" ? SystemCheck.getRepo() : null;
    const author =
      typeof SystemCheck.getAuthor === "function"
        ? SystemCheck.getAuthor()
        : "Sconosciuto";

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: client.user.displayAvatarURL(),
    }).init();

    embed
      .setTitle(`📈 Statistiche di ${client.user.username}`)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        "Ecco una panoramica delle mie statistiche operative e di sistema."
      )
      .addFields(
        { name: "Creatore", value: author, inline: true },
        { name: "Versione", value: `\`${botVersion}\``, inline: true },
        { name: "Uptime", value: uptimeFormatted, inline: true },

        {
          name: "🌐 Server",
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: "👥 Utenti",
          value: `${client.guilds.cache.size.toLocaleString("it-IT")}`,
          inline: true,
        },
        { name: "⏳ Ping", value: `${client.ws.ping}ms`, inline: true },

        { name: "🧠 Memoria", value: `${memoryUsed} MB`, inline: true },
        { name: "📦 Node.js", value: process.version, inline: true },
        { name: "🤖 Discord.js", value: `v${discordJsVersion}`, inline: true }
      );

    if (repoLink) {
      embed.setURL(repoLink);
    }

    return { embeds: [embed] };
  },
};
