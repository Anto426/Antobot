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

    embed.setMainContent(
      clearQueue ? "🛑 Riproduzione Terminata" : "⏸️ Riproduzione Pausata",
      clearQueue
        ? "La musica è stata fermata e la coda è stata svuotata."
        : "La riproduzione è stata messa in pausa. Puoi riprendere con `/resume`."
    );

    return({ embeds: [embed], content: "" });
  },
};
