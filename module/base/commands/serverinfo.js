import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "serverinfo",
  permissions: [],
  isChannelRestricted: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "serverinfo",
    description: "Mostra informazioni sul server",
  },
  execute: async (interaction) => {
    const guild = interaction.guild;

    const embed = await new PresetEmbed({
      guild,
      member: interaction.member,
      image: guild.iconURL({ format: "png", size: 512 }),
    }).init();

    embed
      .setMainContent(
        "🏠 Informazioni Server",
        `Ecco i dettagli su **${guild.name}**:`
      )
      .setThumbnailUrl(guild.iconURL({ dynamic: true }))
      .addFieldInline("🆔 ID", `\`${guild.id}\``)
      .addFieldInline("👑 Owner", `<@${guild.ownerId}>`)
      .addFieldInline(
        "📅 Creato",
        `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`
      )
      .addFieldInline("👥 Membri", `\`${guild.memberCount}\``)
      .addFieldInline("📁 Canali", `\`${guild.channels.cache.size}\``)
      .addFieldInline("🌍 Regione", `\`${guild.preferredLocale}\``);
    await interaction.editReply({ embeds: [embed] });
  },
};
