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

    const embed = new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    });

    embed.setThumbnail(song.thumbnail);
    await embed.init(); 

    embed
      .setTitle(song.name)
      .setURL(song.url) 
      .setDescription(

        `*Caricata da **${
          song.uploader?.name ?? "Sconosciuto"
        }** • Richiesta da ${song.user}*`
      )
      .addFields(
        {
          name: "⏱️ Durata",
          value: song.formattedDuration ?? "N/A",
          inline: true,
        },
        {
          name: "#️⃣ Posizione",
          value: `**1** di **${queue.songs.length}**`,
          inline: true,
        },
        {
          name: "🔁 Loop",
          value:
            queue.repeatMode === 2
              ? "Coda"
              : queue.repeatMode === 1
              ? "Traccia"
              : "Off",
          inline: true,
        },
        { name: "🔊 Volume", value: `${queue.volume}%`, inline: true }
      );

    return { embeds: [embed] };
  },
};
