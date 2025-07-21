import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";

export default {
  name: "toggleplay",
  permissions: [],
  isActive: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: true,
    requireBotInVoiceChannel: true,
    requireTrackInQueue: true,
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireAdditionalTracks: false,
    requireSeekable: false,
  },
  response: false,

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction.guild);

    if (queue.paused) {
      await queue.resume();
    } else {
      await queue.pause();
    }

    const panel = await new NowPlayingPanelBuilder(queue).build();
    await interaction.update(panel);
  },
};
