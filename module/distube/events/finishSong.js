import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "FinishSong",
  eventType: "finishSong",
  isActive: true,

  async execute(queue, song) {
    if (queue.songs.length > 0) return;

    const embed = await new PresetEmbed({
      guild: queue.textChannel.guild,
      member: queue.textChannel.guild.members.me,
      image: queue.songs[0]?.thumbnail,
    }).init();

    embed
      .setTitle("🎶 Coda Terminata!")
      .setDescription(
        "La musica si è fermata. Spero ti sia piaciuto l'ascolto!\nUsa `/play` per aggiungere nuove canzoni."
      )
      .setThumbnail(queue.songs[0]?.thumbnail)
      .setFooter({
        text: `Bot offerto da ${queue.client.user.username}`,
        iconURL: queue.client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await queue.lastPlayingMessage.edit({
      embeds: [embed],
      components: [],
    });
  },
};
