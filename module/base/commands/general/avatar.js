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

    embed
      .setMainContent(
        `👤 Avatar di ${user.username}`,
        `[Link all'avatar](${user.displayAvatarURL({
          size: 4096,
          dynamic: true,
        })})`
      )
      .setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
      .addFieldInline("ID Utente", user.id, true)
      .addFieldInline("Tag Utente", user.tag, true);

    return { embeds: [embed] };
  },
};
