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
        choices: [
          { name: "1 Minuto", value: "1m" },
          { name: "5 Minuti", value: "5m" },
          { name: "10 Minuti", value: "10m" },
          { name: "30 Minuti", value: "30m" },
          { name: "1 Ora", value: "1h" },
          { name: "1 Giorno", value: "1d" },
          { name: "1 Settimana", value: "7d" },
        ],
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
    let durationStr = interaction.options.getString("durata");
    const durationInt = {
      "1m": 60 * 1000,
      "5m": 5 * 60 * 1000,
      "10m": 10 * 60 * 1000,
      "30m": 30 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
    };

    const reason =
      interaction.options.getString("motivo") || "Nessun motivo fornito.";

    if (member.communicationDisabledUntilTimestamp > Date.now()) {
      return interaction.editReply({
        content: "ℹ️ Questo utente è già in timeout.",
      });
    }

    const ms = durationInt[durationStr];
    await member.timeout(ms, reason);

    const expiresTimestamp = Math.floor(
      (Date.now() + ms) / 1000
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
