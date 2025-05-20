import { PermissionsBitField } from "discord.js";
import PresetEmbed from "../../../class/embed/PresetEmbed";

export default {
  name: "kick",
  permissions: [PermissionsBitField.Flags.KickMembers],
  isActive: true,
  isBotAllowed: false,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "kick",
    description: "Espelle un utente dal server",
    options: [
      {
        name: "utente",
        description: "L'utente da espellere",
        type: 6,
        required: true,
      },
      {
        name: "motivo",
        description: "Motivo del kick",
        type: 3,
        required: false,
      },
    ],
  },
  execute: async (interaction) => {
    const target = interaction.options.getUser("utente");
    const reason =
      interaction.options.getString("motivo") || "Nessun motivo fornito";
    const member = interaction.guild.members.cache.get(target.id);

    if (!member)
      return interaction.editReply("❌ Utente non trovato nel server.");
    if (!member.kickable)
      return interaction.editReply("❌ Non posso espellere questo utente.");

    await member.kick(reason);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed
      .setMainContent("👢 Utente Espulso", `**${target.tag}** è stato espulso.`)
      .addField("Motivo", reason, false)
      .addField("Moderatore", interaction.user.tag, false)
      .setThumbnailUrl(target.displayAvatarURL({ dynamic: true }));

    await interaction.editReply({ embeds: [embed] });
  },
};
