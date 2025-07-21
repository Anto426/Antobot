import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "resume",
  permissions: [],
  isActive: true,
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

  async execute(interaction) {
    const { guild, member } = interaction;
    const queue = global.distube.getQueue(guild);
    const song = queue.songs[0];

    queue.resume();

    const embed = await new PresetEmbed({
      guild,
      member,
      image: song.thumbnail,
    }).init();
    embed
      .setTitle("▶️ Riproduzione Ripresa")
      .setDescription(
        `La riproduzione di **[${song.name}](${song.url})** è ripresa.`
      );

    return { embeds: [embed] };
  },
};
