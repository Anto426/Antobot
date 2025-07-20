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
      image: queue.songs[0]?.thumbnail,
    }).init();

    const currentSong = queue.songs[0];
    const nextSongs = queue.songs.slice(1, 6);

    let description = "Nessuna traccia in coda.";
    if (currentSong) {
      description = `**▶️ In Riproduzione**\n[${currentSong.name}](${currentSong.url}) - \`${currentSong.formattedDuration}\`\n`;
      if (nextSongs.length > 0) {
        description += `\n**🔼 Prossime Tracce**\n`;
        description += nextSongs
          .map((song, i) => `**${i + 2}.** [${song.name}](${song.url})`)
          .join("\n");
      }
    }

    embed
      .setTitle(`🎶 Coda Musicale di ${interaction.guild.name}`)
      .setThumbnail(currentSong?.thumbnail)
      .setDescription(description)
      .addFields(
        {
          name: "Tracce Totali",
          value: `**${queue.songs.length}**`,
          inline: true,
        },
        {
          name: "Durata Totale",
          value: `**${queue.formattedDuration}**`,
          inline: true,
        },
        {
          name: "Loop",
          value:
            queue.repeatMode === 2
              ? "Coda"
              : queue.repeatMode === 1
              ? "Traccia"
              : "Off",
          inline: true,
        }
      );

    return { embeds: [embed] };
  },
};
