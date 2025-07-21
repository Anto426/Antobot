import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "autoplay",
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
    name: "autoplay",
    description: "Attiva o disattiva la modalità autoplay",
  },

  async execute(interaction) {
    const { guild } = interaction;
    const queue = global.distube.getQueue(guild);

    await queue.toggleAutoplay();

    queue.lastPlayingMessage.edit(
      await new NowPlayingPanelBuilder(queue).build()
    );

    interaction.deleteReply().catch(() => {});
  },
};
