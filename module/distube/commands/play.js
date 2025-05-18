import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "play",
  permissions: [],
  allowedChannels: true,
  allowedBot: true,
  onlyOwner: false,
  position: false,
  test: false,
  see: true,
  disTube: {
    checkchannel: true,
    checklisttrack: false,
  },
  data: {
    name: "play",
    description: "Aggiungi una traccia alla coda",
    options: [
      {
        name: "song",
        description: "Link o nome della canzone",
        type: 3,
        required: true,
      },
    ],
  },

  async execute(interaction) {
    const songQuery = interaction.options.getString("song");

    const channels = interaction.member.voice.channel;

    await global.distube.play(channels, songQuery, {
      member: interaction.member,
      textChannel: interaction.channel,
      message: null,
    });

    const queue = global.distube.getQueue(interaction);
    const song = queue.songs[queue.songs.length - 1];

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: song.thumbnail,
    }).init();

    embed
      .setMainContent(
        "🎶 Traccia Aggiunta",
        `**${song.name}** è stata aggiunta alla coda da **${interaction.user.tag}**.`
      )
      .setThumbnail(song.thumbnail)
      .addFieldInline("🎵 Titolo", song.name, true)
      .addFieldInline("⏱️ Durata", song.formattedDuration ?? "N/A", true)
      .addFieldInline("🧑‍🎤 Autore", song.uploader?.name ?? "Sconosciuto", true)
      .addFieldInline("📎 Link", `[Vai alla traccia](${song.url})`, true)
      .addFieldInline("🔢 Posizione in coda", `${queue.songs.length}`, true)
      .addFieldInline(
        "🔊 Canale vocale",
        interaction.member.voice.channel?.name ?? "N/A",
        true
      )
      .setFooterFromMember()
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      content: "",
    });
  },
};
