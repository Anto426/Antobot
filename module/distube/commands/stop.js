import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "stop",
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
    requireAdditionalTracks: false,
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireSeekable: false,
  },
  data: {
    name: "stop",
    description: "Ferma la riproduzione e svuota la coda.",
  },

  async execute(interaction) {
    const { guild } = interaction;
    const queue = global.distube.getQueue(guild);

    await queue.stop();

    interaction.deleteReply().catch(() => {});
  },
};
