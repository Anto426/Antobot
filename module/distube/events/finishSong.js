import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "FinishSong",
  eventType: "finishSong",
  isActive: true,
  async execute(queue, song) {
    const embed = await new PresetEmbed({
      guild: queue.textChannel.guild,
      member: song.member,
      image: song.thumbnail,
    }).init();

    embed
      .setAuthor({
        name: "🎶  Traccia Terminata",
        iconURL: queue.textChannel.guild.iconURL() ?? undefined,
      })
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setDescription(
        `**Artista:** [${song.uploader?.name || "Sconosciuto"}](${
          song.uploader?.url || song.url
        })`
      )
      .addFields(
        {
          name: "⏱️ Durata",
          value: song.formattedDuration || "N/A",
          inline: true,
        },
        {
          name: "📀 Posizione in coda",
          value: `${queue.songs.indexOf(song) + 1}/${queue.songs.length}`,
          inline: true,
        },
        {
          name: "🔊 Volume",
          value: `${queue.volume}%`,
          inline: true,
        }
      );

    queue.textChannel.send({ embeds: [embed] });
  },
};
