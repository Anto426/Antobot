import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "PlaySong",
  eventType: "playSong",
  isActive: true,
  async execute(queue, song) {
    const embed = await new PresetEmbed({
      guild: queue.textChannel.guild,
      member: null,
      image: song.thumbnail,
    }).init();

    embed
      .setTitle(`▶️ ${song.name}`)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setDescription(
        `*Caricata da **${
          song.uploader?.name ?? "Sconosciuto"
        }** • Richiesta da ${song.user}*`
      )
      .addFields(
        {
          name: "⏱️ Durata",
          value: song.formattedDuration ?? "N/A",
          inline: true,
        },
        {
          name: "#️⃣ Posizione",
          value: `**1** di **${queue.songs.length}**`,
          inline: true,
        },
        {
          name: "🔁 Loop",
          value:
            queue.repeatMode === 2
              ? "Coda"
              : queue.repeatMode === 1
              ? "Traccia"
              : "Off",
          inline: true,
        },
        { name: "🔊 Volume", value: `${queue.volume}%`, inline: true }
      );

    await queue.textChannel.send({ embeds: [embed] });
  },
};
