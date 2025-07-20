import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "play",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: true,
    requireBotInVoiceChannel: false,
    requireTrackInQueue: false,
    requireAdditionalTracks: false,
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireSeekable: false,
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

  async execute(interaction, channels) {
    const songQuery = interaction.options.getString("song");

    await global.distube.play(channels[0] || channels[1], songQuery, {
      member: interaction.member,
      textChannel: interaction.channel,
      message: null,
    });

    const queue = global.distube.getQueue(interaction);
    const song = queue.songs[queue.songs.length - 1];

    const embed = new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    });

    embed.setThumbnail(song.thumbnail);
    await embed.init();

    const songPosition = queue.songs.indexOf(song);
    const songsAhead = songPosition > 0 ? songPosition : 0;

    embed
      .setTitle("✅ Aggiunto alla Coda")
      .setDescription(`**[${song.name}](${song.url})**`)
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
        },
        {
          name: "Posizione in Coda",
          value: `**#${songPosition + 1}**`,
          inline: true,
        },
        { name: "Brani Prima di Questo", value: `${songsAhead}`, inline: true }
      );

    return {
      embeds: [embed],
      content: "",
    };
  },
};
