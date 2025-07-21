import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "resume",
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
    disallowIfPlaying: true,
    requireSeekable: false,
  },
  data: {
    name: "resume",
    description: "Riprendi la riproduzione corrente",
  },

  async execute(interaction) {
    const { guild } = interaction;
    const queue = global.distube.getQueue(guild);

    await queue.resume();

    queue.lastPlayingMessage.edit(
      await new NowPlayingPanelBuilder(queue).build()
    );

    interaction.deleteReply().catch(() => {});
  },
};
