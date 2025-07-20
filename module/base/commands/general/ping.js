import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import { version as discordJsVersion } from "discord.js";
import { version as nodeVersion } from "process";

export default {
  name: "ping",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "ping",
    description: "Test latenza con embed avanzato",
  },
  execute: async (interaction) => {
    const now = Date.now();
    const clientLatency = now - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const uptimeFormatted = new Time().formatDuration(process.uptime() * 1000);
    const memoryMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const getStatusIndicator = (ping) => {
      if (ping < 150) return "🟢";
      if (ping < 300) return "🟡";
      return "🔴";
    };

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: interaction.client.user.displayAvatarURL(),
    }).init();

    embed
      .setTitle("🏓 Pong!")
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        {
          name: "Latenza Bot 🤖",
          value: `${getStatusIndicator(clientLatency)} \`${clientLatency}ms\``,
          inline: true,
        },
        {
          name: "Latenza API 🌐",
          value: `${getStatusIndicator(apiLatency)} \`${apiLatency}ms\``,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: false },
        {
          name: "Uptime",
          value: uptimeFormatted,
          inline: true,
        },
        {
          name: "Memoria",
          value: `${memoryMb} MB`,
          inline: true,
        }
      );

    return { embeds: [embed] };
  },
};
