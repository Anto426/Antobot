import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "userinfo",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "userinfo",
    description: "Mostra informazioni sull'utente",
    options: [
      {
        name: "utente",
        description: "L'utente di cui vuoi vedere le informazioni",
        type: 6,
        required: false,
      },
    ],
  },
  execute: async (interaction) => {
    const user = interaction.options?.getUser("utente") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: user.displayAvatarURL({ format: "png", size: 512 }),
    }).init();

    embed
      .setMainContent(
        "👤 Informazioni Utente",
        `Ecco i dettagli su **${user.username}**:`
      )
      .setThumbnailUrl(user.displayAvatarURL({ dynamic: true }))
      .addFieldInline("🆔 ID", `\`${user.id}\``)
      .addFieldInline("📛 Username", `\`${user.tag}\``)
      .addFieldInline(
        "🕒 Account Creato",
        `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`
      )
      .addFieldInline(
        "🗓️ Entrato nel server",
        member
          ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
          : "`Non disponibile`"
      )
      .addFieldInline(
        "🎭 Ruoli",
        member
          ? `${member.roles.cache.map((r) => r).join(" ")}`
          : "`Nessun ruolo`"
      );

    await interaction.editReply({ embeds: [embed] });
  },
};
