import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "autoplay",
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

    await queue.toggleAutoplay();

    const panel = await new NowPlayingPanelBuilder(queue).build();
    await interaction.update(panel);
  },
};
