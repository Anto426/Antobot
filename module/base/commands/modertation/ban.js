import { PermissionsBitField } from "discord.js";
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";

export default {
  name: "ban",
  permissions: [PermissionsBitField.Flags.BanMembers],
  isActive: true,
  isBotAllowed: false,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  data: {
    name: "ban",
    description: "Banna un utente dal server",
    options: [
      {
        name: "utente",
        description: "L'utente da bannare",
        type: 6,
        required: true,
      },
      {
        name: "motivo",
        description: "Motivo del ban",
        type: 3,
        required: false,
      },
    ],
  },
  execute: async (interaction) => {
    const target = interaction.options.getUser("utente");
    const reason =
      interaction.options.getString("motivo") || "Nessun motivo fornito.";
    const member = interaction.guild.members.cache.get(target.id);

    await member.ban({ reason });

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: target.displayAvatarURL({ dynamic: true }),
    }).init();

    embed
      .setTitle("🔨 Utente Bannato")
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
