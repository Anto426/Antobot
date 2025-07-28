import PresetEmbed from "../../../../class/embed/PresetEmbed.js";

export default {
  name: "avatar",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: false,
  data: {
    name: "avatar",
    description: "Mostra l'avatar dell'utente",
    options: [
      {
        name: "utente",
        description: "L'utente di cui vuoi vedere l'avatar",
        type: 6,
        required: false,
      },
    ],
  },
  execute: async (interaction) => {
    const user = interaction.options.getUser("utente") || interaction.user;

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: user.displayAvatarURL({ size: 512, dynamic: true }),
    }).init();

    const avatarUrl = user.displayAvatarURL({ size: 4096, dynamic: true });
    const downloadLinks = `[PNG](${user.displayAvatarURL().replace("webp", "png")}) | [JPG](${user.displayAvatarURL().replace("webp", "jpg")}) | [WEBP](${user.displayAvatarURL().replace("webp", "webp")})`;

    embed
      .setTitle(`👤 Avatar di ${user.tag}`)
      .setDescription(`**Link per il download:**\n${downloadLinks}`)
      .setImage(avatarUrl)
      .addFields(
        {
          name: "ID Utente",
          value: `\`${user.id}\``,
          inline: true,
        },
        {
          name: "Account Creato",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          inline: true,
        }
      );

    return { embeds: [embed] };
  },
};
