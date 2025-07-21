import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "repeat",
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
    name: "repeat",
    description: "Imposta la modalità di ripetizione per la coda.",
    options: [
      {
        name: "mode",
        description: "Scegli il tipo di ripetizione",
        type: 3, // String type
        required: true,
        choices: [
          { name: "❌ Off", value: "0" },
          { name: "🔂 Traccia", value: "1" },
          { name: "🔁 Coda", value: "2" },
        ],
      },
    ],
  },

  async execute(interaction) {
    const { guild } = interaction;
    const queue = global.distube.getQueue(guild);

    const mode = parseInt(interaction.options.getString("mode"));

    await queue.setRepeatMode(mode);

    queue.lastPlayingMessage.edit(
      await new NowPlayingPanelBuilder(queue).build()
    );

    interaction.deleteReply().catch(() => {});
  },
};
