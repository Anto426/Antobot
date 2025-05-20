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

    const modeText = [
      "🔁 Ripetizione disattivata",
      "🔂 Ripetizione della traccia attivata",
      "🔁 Ripetizione della coda attivata",
    ];
    embed.setMainContent("⚙️ Modalità Repeat", modeText[repeatMap[mode]]);

    await interaction.editReply({ embeds: [embed], content: "" });
  },
};
