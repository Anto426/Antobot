import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "queue",
  permissions: [],
  isActive: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: false,
    requireBotInVoiceChannel: true,
    requireTrackInQueue: true,
    requireAdditionalTracks: false,
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireSeekable: false,
  },
  response: false,

  async execute(interaction) {
    const { guild, member } = interaction;
    const queue = global.distube.getQueue(guild);

    const currentSong = queue.songs[0];
    const nextSongs = queue.songs.slice(1, 11);

    let description = `**▶️ In Riproduzione**\n[${currentSong.name}](${currentSong.url}) - \`${currentSong.formattedDuration}\`\n`;
    if (nextSongs.length > 0) {
      description += `\n**🔼 Prossime Tracce**\n`;
      description += nextSongs
        .map((song, i) => `**${i + 2}.** [${song.name}](${song.url})`)
        .join("\n");
    }

    const embed = await new PresetEmbed({
      guild,
      member,
      image: currentSong.thumbnail,
    }).init();
    embed
      .setTitle(`🎶 Coda Musicale`)
      .setThumbnail(currentSong.thumbnail)
      .setDescription(description)
      .addFields(
        {
          name: "Tracce Totali",
          value: `**${queue.songs.length}**`,
          inline: true,
        },
        {
          name: "Durata Totale",
          value: `**${queue.formattedDuration}**`,
          inline: true,
        }
      );

    return { embeds: [embed], ephemeral: true };
  },
};
