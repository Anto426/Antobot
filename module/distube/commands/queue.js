import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "queue",
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
    name: "queue",
    description: "Visualizza la coda attuale",
  },

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction);

    const songList = queue.songs
      .map(
        (s, i) =>
          `**${i + 1}.** [${s.name}](${s.url}) — \`${s.formattedDuration}\``
      )
      .slice(0, 10)
      .join("\n");

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: queue.songs[0].thumbnail,
    }).init();

    embed
      .setMainContent("📃 Coda Attuale", songList || "Nessuna traccia in coda.")
      .addFieldInline("🔢 Tracce totali", `${queue.songs.length}`)
      .addFieldInline("🔊 Volume", `${queue.volume}%`)
      .addFieldInline(
        "🔁 Loop",
        queue.repeatMode === 2
          ? "Coda"
          : queue.repeatMode === 1
          ? "Traccia"
          : "Off"
      );

    await interaction.editReply({ embeds: [embed], content: "" });
  },
};
