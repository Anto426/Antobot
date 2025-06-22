import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import { version as discordJsVersion } from "discord.js";
import { version as nodeVersion } from "process";
import SystemCheck from "../../../../class/client/SystemCheck.js";
import Time from "../../../../class/Time/time.js";

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

    const time = new Time();
    const uptimeMs = process.uptime() * 1000;
    const uptimeFormatted = time.formatDuration(uptimeMs);

    const servers = client.guilds.cache.size;
    const users = client.users.cache.size;

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: client.user.displayAvatarURL({ format: "png", size: 512 }),
    }).init();

    const memory = process.memoryUsage();
    const heapUsed = (memory.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotal = (memory.heapTotal / 1024 / 1024).toFixed(2);
    const cpu = process.cpuUsage();
    const cpuUser = (cpu.user / 1_000_000).toFixed(2);
    const cpuSystem = (cpu.system / 1_000_000).toFixed(2);
    const ping = client.ws.ping;

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

    embed
      .setMainContent(
        "ℹ️ Info Bot",
        "Ecco alcune statistiche dettagliate sul bot e sull'ambiente:"
      )
      .setThumbnailUrl(client.user.displayAvatarURL({ dynamic: true }))
      .addFieldInline("📛 Nome", client.user.tag, true)
      .addFieldInline("🆔 ID", client.user.id, true)
      .addFieldInline(
        "🗓️ Creato il",
        `<t:${Math.floor(client.user.createdTimestamp / 1000)}:D>`,
        true
      )
      .addFieldInline("📈 Uptime", uptimeFormatted, true)
      .addFieldInline("🌐 Server", `${servers}`, true)
      .addFieldInline("👥 Utenti", `${users}`, true)
      .addFieldInline("📦 Versione Bot", botVersion, true)
      .addFieldInline("📦 Node.js", `v${nodeVersion}`, true)
      .addFieldInline("🤖 Discord.js", `v${discordJsVersion}`, true)
      .addFieldInline("⏳ Ping WS", `${ping} ms`, true)
      .addFieldInline("💾 Heap Usata", `${heapUsed} MB`, true)
      .addFieldInline("📊 Heap Totale", `${heapTotal} MB`, true)
      .addFieldInline("⚙️ CPU (user)", `${cpuUser} ms`, true)
      .addFieldInline("⚙️ CPU (system)", `${cpuSystem} ms`, true)
      .addFieldInline("🔧 Architettura", process.arch, true)
      .addFieldInline("🖥️ Piattaforma", process.platform, true);

    if (repoLink) {
      embed.addFieldInline("🔗 Repository", `[GitHub](${repoLink})`, true);
    }

    embed.addFieldInline("👤 Creatore", author, true);

    await interaction.editReply({ embeds: [embed] });
  },
};
