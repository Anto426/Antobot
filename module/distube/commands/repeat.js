import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "repeat",
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
    name: "repeat",
    description: "Imposta la modalità loop",
    options: [
      {
        name: "mode",
        description: "Tipo di ripetizione",
        type: 3,
        required: true,
        choices: [
          { name: "Off", value: "off" },
          { name: "Traccia", value: "track" },
          { name: "Coda", value: "queue" },
        ],
      },
    ],
  },

  async execute(interaction) {
    const mode = interaction.options.getString("mode");
    const queue = global.distube.getQueue(interaction);

    const repeatMap = { off: 0, track: 1, queue: 2 };
    queue.setRepeatMode(repeatMap[mode]);
    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    const modeDetails = {
      0: {
        status: "❌ Disattivata",
        explanation: "La musica si fermerà alla fine della coda.",
      },
      1: {
        status: "🔂 Traccia Corrente",
        explanation: "La traccia attuale verrà riprodotta in loop.",
      },
      2: {
        status: "🔁 Coda Intera",
        explanation: "L'intera coda verrà riprodotta in loop dall'inizio.",
      },
    };

    const currentMode = modeDetails[repeatMap[mode]] ?? modeDetails[0];

    embed
      .setTitle("⚙️ Impostazioni di Ripetizione")
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        {
          name: "Nuovo Stato",
          value: `**${currentMode.status}**`,
          inline: false,
        },
        {
          name: "Cosa Significa?",
          value: currentMode.explanation,
          inline: false,
        }
      );

    return { embeds: [embed] };
  },
};
