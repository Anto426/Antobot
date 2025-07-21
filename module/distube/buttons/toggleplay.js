import PresetEmbed from "../../../class/embed/PresetEmbed.js";

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

  async execute(interaction) {
    const { guild, member } = interaction;
    const queue = global.distube.getQueue(guild);
    const song = queue.songs[0];

    const embed = await new PresetEmbed({
      guild,
      member,
      image: song.thumbnail,
    }).init();

    if (queue.paused) {
      queue.resume();
      embed
        .setTitle("▶️ Riproduzione Ripresa")
        .setDescription(
          `La riproduzione di **[${song.name}](${song.url})** è ripresa.`
        );
    } else {
      queue.pause();
      embed
        .setTitle("⏸️ Riproduzione in Pausa")
        .setDescription(
          `La riproduzione di **[${song.name}](${song.url})** è stata messa in pausa.`
        );
    }

    return { embeds: [embed], ephemeral: true };
  },
};
