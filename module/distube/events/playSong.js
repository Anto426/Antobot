import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "PlaySong",
  eventType: "playSong",
  allowevents: true,
  async execute(queue, song) {
    try {
      const embed = await new PresetEmbed({
        guild: queue.textChannel.guild,
        member: null,
        image: song.thumbnail,
      }).init();

      embed
        .setAuthor({
          name: "🎶 Ora in riproduzione",
          iconURL: queue.textChannel.guild.iconURL() || undefined,
        })
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setDescription(`**Artista:** ${song.uploader?.name || "Sconosciuto"}`)
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

      await queue.textChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Errore evento playSong:", error);
    }
  },
};
