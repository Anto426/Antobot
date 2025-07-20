import { PermissionsBitField, ApplicationCommandOptionType } from "discord.js";
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";

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
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "motivo",
        description: "Motivo del kick",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },
  execute: async (interaction) => {
    const target = interaction.options.getUser("utente");
    const reason =
      interaction.options.getString("motivo") || "Nessun motivo fornito.";
    const member = interaction.guild.members.cache.get(target.id);

    await member.kick(reason);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: target.displayAvatarURL({ dynamic: true }),
    }).init();

    embed
      .setTitle("👢 Utente Espulso")
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "👤 Utente",
          value: `${target.tag}\n\`${target.id}\``,
          inline: true,
        },
        {
          name: "👮 Moderatore",
          value: `${interaction.user.tag}\n\`${interaction.user.id}\``,
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
