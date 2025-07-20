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
    const downloadLinks = `[PNG](${user.displayAvatarURL({
      format: "png",
      size: 4096,
    })}) | [JPG](${user.displayAvatarURL({
      format: "jpg",
      size: 4096,
    })}) | [WEBP](${user.displayAvatarURL({ format: "webp", size: 4096 })})`;

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
