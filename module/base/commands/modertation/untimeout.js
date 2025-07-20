import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";

export default {
  name: "untimeout",
  permissions: [PermissionsBitField.Flags.ModerateMembers],
  isActive: true,
  isBotAllowed: false,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "untimeout",
    description: "Rimuove il timeout da un utente",
    options: [
      {
        name: "utente",
        description: "Utente a cui rimuovere il timeout",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "motivo",
        description: "Motivo della rimozione del timeout",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  execute: async (interaction) => {
    const member = interaction.options.getMember("utente");
    const reason =
      interaction.options.getString("motivo") || "Nessun motivo fornito.";

    if (!member.communicationDisabledUntilTimestamp) {
      return interaction.editReply({
        content: "ℹ️ Questo utente non è attualmente in timeout.",
      });
    }

    await member.timeout(null, reason);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: member.user.displayAvatarURL({ dynamic: true }),
    }).init();

    embed
      .setTitle("🔓 Timeout Rimosso")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "👤 Utente",
          value: `${member.user.tag}\n\`${member.id}\``,
          inline: true,
        },
        {
          name: "👮 Moderatore",
          value: `${interaction.user.tag}\n\`${interaction.user.id}\``,
          inline: true,
        },
        {
          name: "📄 Motivo della Rimozione",
          value: reason,
          inline: false,
        }
      );

    return { embeds: [embed] };
  },
};
