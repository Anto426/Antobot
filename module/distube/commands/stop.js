import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "stop",
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
    requireBotInVoiceChannel: true,
    requireTrackInQueue: true,
    requireAdditionalTracks: false,
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireSeekable: false,
  },
  data: {
    name: "stop",
    description: "Ferma la riproduzione e svuota la coda.",
  },

  async execute(interaction) {
    const { guild } = interaction;
    const queue = global.distube.getQueue(guild);
    const song = queue.songs[0];

    await queue.stop();

    const embed = await new PresetEmbed({
      guild: guild,
      member: interaction.member,
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

    queue.lastPlayingMessage.edit({
      embeds: [embed],
      components: [],
    });

    interaction.deleteReply().catch(() => {});
  },
};
