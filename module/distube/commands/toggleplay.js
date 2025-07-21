import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "toggleplay",
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
    name: "toggleplay",
    description: "Attiva o disattiva la riproduzione corrente",
  },
  async execute(interaction) {
    const { guild } = interaction;
    const queue = global.distube.getQueue(guild);

    if (queue.paused) {
      queue.resume();
    } else {
      queue.pause();
    }

    queue.lastPlayingMessage.edit(
      await new NowPlayingPanelBuilder(queue).build()
    );

    interaction.deleteReply().catch(() => {});
  },
};
