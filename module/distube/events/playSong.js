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
        .setMainContent(
          "▶️ Riproduzione Iniziata",
          `Sta suonando ora la traccia nella coda.`
        )
        .addFieldInline("🎵 Titolo", song.name, true)
        .addFieldInline("⏱️ Durata", song.formattedDuration || "N/A", true)
        .addFieldInline(
          "🧑‍🎤 Artista",
          song.uploader?.name || "Sconosciuto",
          true
        )
        .addFieldInline("📎 Link", `[Vai alla traccia](${song.url})`, true)
        .setFooter("Enjoy your music!")
        .setTimestamp();

      await queue.textChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Errore evento playSong:", error);
    }
  },
};
