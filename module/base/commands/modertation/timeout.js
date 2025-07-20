import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import Time from "../../../../class/services/time.js";

export default {
  name: "timeout",
  permissions: [PermissionsBitField.Flags.ModerateMembers],
  isActive: true,
  isBotAllowed: false,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "timeout",
    description: "Imposta un timeout su un utente",
    options: [
      {
        name: "utente",
        description: "Utente da mettere in timeout",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "durata",
        description: "Durata del timeout (es. 1m, 30m, 1h, 1d)",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "motivo",
        description: "Motivo del timeout",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  execute: async (interaction) => {
    const time = new Time();
    const member = interaction.options.getMember("utente");
    const durationStr = interaction.options.getString("durata");
    const reason =
      interaction.options.getString("motivo") || "Nessun motivo fornito.";

    if (member.communicationDisabledUntilTimestamp > Date.now()) {
      return interaction.editReply({
        content: "ℹ️ Questo utente è già in timeout.",
      });
    }

    const ms = time.formatDuration(durationStr);
    await member.timeout(ms, reason);

    const expiresTimestamp = Math.floor(
      member.communicationDisabledUntilTimestamp / 1000
    );

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: member.user.displayAvatarURL({ dynamic: true }),
    }).init();

    embed
      .setTitle("⏳ Timeout Applicato")
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
        { name: "\u200B", value: "\u200B" },
        {
          name: "Durata",
          value: durationStr,
          inline: true,
        },
        {
          name: "Scade",
          value: `<t:${expiresTimestamp}:R>`,
          inline: true,
        },
        {
          name: "📄 Motivo",
          value: reason,
          inline: false,
        }
      );

    return { embeds: [embed] };
  },
};
