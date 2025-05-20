import PresetEmbed from "../../../class/embed/PresetEmbed.js";
export default {
  name: "autoplay",
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
    name: "autoplay",
    description: "Attiva o disattiva la modalità autoplay",
  },

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction);
    const newAutoplayState = queue.toggleAutoplay();

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed.setMainContent(
      "🔁 Modalità Autoplay",
      `Autoplay ${newAutoplayState ? "✅ Attivato" : "❌ Disattivato"}`
    );

    await interaction.editReply({ embeds: [embed], content: "" });
  },
};
