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
      .setTitle("🎶 Traccia Terminata")
      .setThumbnail(song.thumbnail)
      .setDescription(`**[${song.name}](${song.url})** ha finito di suonare.`)
      .addFields(
        {
          name: "Artista",
          value: song.uploader?.name ?? "Sconosciuto",
          inline: true,
        },
        {
          name: "Durata",
          value: song.formattedDuration ?? "N/A",
          inline: true,
        }
      );

    queue.textChannel.send({ embeds: [embed] });
  },
};
