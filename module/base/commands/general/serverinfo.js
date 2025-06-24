import PresetEmbed from "../../../../class/embed/PresetEmbed.js";

export default {
  name: "serverinfo",
  permissions: [],
  isActive: true,
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
        `✨ Benvenuto nelle info di **${guild.name}**!\nEcco tutti i dettagli:`
      )
      .setThumbnailUrl(guild.iconURL({ dynamic: true }))
      .addFieldInline("🆔 ID Server", `\`${guild.id}\``)
      .addFieldInline("👑 Proprietario", `<@${guild.ownerId}>`)
      .addFieldInline(
        "📅 Creato",
        `<t:${Math.floor(guild.createdTimestamp / 1000)}:F> (<t:${Math.floor(
          guild.createdTimestamp / 1000
        )}:R>)`
      )
      .addFieldInline("👥 Membri", `\`${guild.memberCount}\``)
      .addFieldInline("📁 Canali", `\`${guild.channels.cache.size}\``)
      .addFieldInline("🎭 Ruoli", `\`${guild.roles.cache.size}\``)
      .addFieldInline("🌍 Regione", `\`${guild.preferredLocale}\``)
      .addFieldInline("🔒 Verifica", `\`${guild.verificationLevel}\``)
      .addFieldInline(
        "📝 Descrizione",
        guild.description ? guild.description : "Nessuna"
      )
      .addFieldInline("📜 Boost Livello", `\`${guild.premiumTier}\``)
      .addFieldInline(
        "🚀 Boost Totali",
        `\`${guild.premiumSubscriptionCount ?? 0}\``
      )
      .addFieldInline("🤝 Partner", guild.partnered ? "Sì" : "No")
      .addFieldInline("✅ Verificato", guild.verified ? "Sì" : "No")
      .addFieldInline(
        "🖼️ Banner",
        guild.bannerURL()
          ? `[Visualizza banner](${guild.bannerURL({ size: 512 })})`
          : "Nessuno"
      )
      .addFieldInline(
        "🔗 Invito",
        guild.vanityURLCode ? `discord.gg/${guild.vanityURLCode}` : "Nessuno"
      );
    await interaction.editReply({ embeds: [embed] });
  },
};
