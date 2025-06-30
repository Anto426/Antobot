import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "nowplaying",
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
  },
  data: {
    name: "nowplaying",
    description: "Mostra la traccia attualmente in riproduzione",
  },

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction);
    const song = queue.songs[0];

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: song.thumbnail,
    }).init(false);

    embed
      .setMainContent("🎧 In Riproduzione", `**[${song.name}](${song.url})**`)
      .setThumbnailUrl(song.thumbnail)
      .addInlineFields([
        {
          name: "🧑‍🎤 Autore",
          value: song.uploader?.name ?? "Sconosciuto",
          inline: true,
        },
        {
          name: "⏱️ Durata",
          value: song.formattedDuration ?? "N/A",
          inline: true,
        },
        {
          name: "👤 Richiesto da",
          value: song.user?.toString() ?? "N/A",
          inline: true,
        },
        { name: "🔊 Volume", value: `${queue.volume}%`, inline: true },
        {
          name: "🔁 Modalità Loop",
          value:
            queue.repeatMode === 2
              ? "Coda"
              : queue.repeatMode === 1
              ? "Traccia"
              : "Off",
          inline: true,
        },
        {
          name: "📎 Link",
          value: `[Vai alla traccia](${song.url})`,
          inline: true,
        },
      ])
      .setFooter({ text: `Posizione in coda: 1/${queue.songs.length}` });
    await embed._applyColorFromImage();

    return { embeds: [embed], content: "" };
  },
};
