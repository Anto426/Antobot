import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "repeat",
  permissions: [],
  isActive: true,
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
  response: false,

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction.guild);

    const newMode = (queue.repeatMode + 1) % 3;
    queue.setRepeatMode(newMode);

    const panel = await new NowPlayingPanelBuilder(queue).build();
    await interaction.update(panel);
  },
};
