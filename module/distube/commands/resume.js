import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "resume",
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
    disallowIfPlaying: true,
  },
  data: {
    name: "resume",
    description: "Riprendi la riproduzione corrente",
  },

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction);
    const song = queue.songs[0];
    await queue.resume();

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: song.thumbnail,
    }).init(false);

    embed
      .setMainContent(
        "▶️ Riproduzione Ripresa",
        `**${song.name}** è ora in riproduzione.`
      )
      .setThumbnailUrl(song.thumbnail)
      .addInlineFields([
        { name: "🧑‍🎤 Autore", value: song.uploader?.name ?? "Sconosciuto" },
        { name: "⏱️ Durata", value: song.formattedDuration ?? "N/A" },
        { name: "🎵 Posizione", value: `1/${queue.songs.length}` },
      ])
      .addFieldInline("📎 Link", `[Apri traccia](${song.url})`)
      .addFieldInline("🔊 Volume", `${queue.volume}%`)
      await embed._applyColorFromImage();

    await interaction.editReply({ embeds: [embed], content: "" });
  },
};
