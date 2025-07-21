import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "stop",
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
  response: false,

  async execute(interaction) {
    const { guild, member, client } = interaction;
    const queue = client.distube.getQueue(guild);
    const song = queue.songs[0];

    await queue.stop();

    const embed = await new PresetEmbed({
      guild,
      member,
      image: song.thumbnail,
    }).init();

    embed
      .setTitle("🛑 Riproduzione Terminata")
      .setThumbnail(song.thumbnail)
      .setDescription(
        `La riproduzione di **[${song.name}](${song.url})** è stata interrotta.`
      )
      .addFields(
        { name: "Richiesta da", value: song.user.toString(), inline: true },
        {
          name: "Artista",
          value: song.uploader?.name ?? "Sconosciuto",
          inline: true,
        },
        {
          name: "Durata",
          value: `\`${song.formattedDuration}\``,
          inline: true,
        },
        {
          name: "Interrotto da",
          value: interaction.user.toString(),
          inline: true,
        }
      );

    await interaction.update({ embeds: [embed], components: [] });
  },
};
