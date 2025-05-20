import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "shuffle",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: true,
    requireBotInVoiceChannel: true,
    requireTrackInQueue: true,
    requireAdditionalTracks: true,
  },
  data: {
    name: "shuffle",
    description: "Mischia la coda attuale",
  },

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction);
    queue.shuffle();

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed.setMainContent(
      "🔀 Coda Mischiata",
      "Le tracce nella coda sono state mischiate."
    );

    await interaction.editReply({ embeds: [embed], content: "" });
  },
};
