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
    const created = interaction.createdTimestamp;
    const clientLatency = now - created;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const uptime = new Date(process.uptime() * 1000)
      .toISOString()
      .substr(11, 8);
    const memoryMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: interaction.client.user.displayAvatarURL({
        format: "png",
        size: 512,
      }),
    }).init();

    embed
      .setMainContent(
        "🏓 Pong!",
        "Ecco tutti i dettagli sulla latenza e lo stato del bot:"
      )
      .setThumbnailUrl(
        interaction.client.user.displayAvatarURL({ dynamic: true })
      )
      .addFieldInline("🖥️ Client Latency", `\`${clientLatency} ms\``)
      .addFieldInline("🌐 API Latency", `\`${apiLatency} ms\``)
      .addFieldInline("⏱️ Uptime", `\`${uptime}\``)
      .addFieldInline("💾 Memory Used", `\`${memoryMb} MB\``)
      .addFieldInline("📦 Node.js", `\`${nodeVersion}\``)
      .addFieldInline("🤖 Discord.js", `\`${discordJsVersion}\``);
    return({ embeds: [embed] });
  },
};
