import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "autoplay",
  permissions: [],
  isActive: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: true,
    requireBotInVoiceChannel: true,
    requireTrackInQueue: true,
  },

  async execute(interaction) {
    const { guild, member } = interaction;
    const queue = global.distube.getQueue(guild);

    const newAutoplayState = await queue.toggleAutoplay();

    const embed = await new PresetEmbed({ guild, member }).init();
    embed
      .setTitle("♾️ Modalità Autoplay")
      .setDescription(
        `La riproduzione automatica è ora ${
          newAutoplayState ? "✅ **Attivata**" : "❌ **Disattivata**"
        }.`
      );

    return { embeds: [embed], ephemeral: true };
  },
};
