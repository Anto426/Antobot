import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "skip",
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
    requireTrackInQueue: true,
    requireAdditionalTracks: true,
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireSeekable: false,
  },
  data: {
    name: "skip",
    description: "Salta la traccia corrente",
  },
  async execute(interaction) {
    const queue = global.distube.getQueue(interaction.guildId);
    await global.distube.skip(interaction.guildId);

    const currentSong = queue.songs[0];

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: currentSong.thumbnail,
    }).init(false);

    embed
      .setMainContent(
        "⏭️ Traccia Saltata",
        "Hai saltato la traccia corrente con successo!"
      )
      .addFieldInline("🎵 Titolo", currentSong.name, true)
      .addFieldInline("⏱️ Durata", currentSong.formattedDuration || "N/A", true)
      .addFieldInline(
        "🧑‍🎤 Artista",
        currentSong.uploader?.name || "Sconosciuto",
        true
      );
    await embed._applyColorFromImage();

    await interaction.editReply({ embeds: [embed] });
  },
};
