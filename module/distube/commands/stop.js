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
  },
  data: {
    name: "stop",
    description: "Ferma la riproduzione, con possibilità di svuotare la coda",
    options: [
      {
        name: "clear",
        type: 5,
        description: "Svuota la coda oltre a fermare la musica",
        required: false,
      },
    ],
  },

  async execute(interaction) {
    const clearQueue = interaction.options.getBoolean("clear") ?? false;
    const queue = global.distube.getQueue(interaction);

    if (clearQueue) {
      await queue.stop();
    } else {
      await queue.pause();
    }

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    if (clearQueue) {
      const tracksRemoved = queue.songs.length;
      embed
        .setTitle("🛑 Riproduzione Terminata")
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setDescription(
          "La musica è stata fermata e tutte le tracce in coda sono state rimosse."
        )
        .addFields({
          name: "Tracce Rimosse",
          value: `**${tracksRemoved}**`,
          inline: true,
        });
    } else {
      const currentSong = queue.songs[0];
      embed
        .setTitle("⏸️ Riproduzione in Pausa")
        .setThumbnail(currentSong?.thumbnail)
        .setDescription(
          `La riproduzione di **[${currentSong?.name ?? "traccia attuale"}](${
            currentSong?.url
          })** è in pausa.`
        )
        .addFields({
          name: "Consiglio",
          value: "Usa il comando `/resume` per riprendere.",
          inline: false,
        });
    }

    return { embeds: [embed] };
  },
};
