import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "skip",
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
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireSeekable: false,
  },
  data: {
    name: "skip",
    description: "Salta la traccia corrente",
  },

  async execute(interaction) {
    const { guild } = interaction;
    const queue = global.distube.getQueue(guild);

    await queue.skip();

    queue.lastPlayingMessage.edit(
      await new NowPlayingPanelBuilder(queue).build()
    );

    interaction.deleteReply().catch(() => {});
  },
};
