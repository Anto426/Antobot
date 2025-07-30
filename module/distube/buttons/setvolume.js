import NowPlayingPanelBuilder from "../../../class/services/NowPlayingPanelBuilder.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "setvolume",
  permissions: [],
  isActive: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: true,
    requireTrackInQueue: true,
  },
  response: false,

  async execute(interaction) {
    const { guild, member } = interaction;
    const queue = global.distube.getQueue(guild);

    const volume = parseInt(
      interaction.fields.getTextInputValue("volumeInput")
    );

    if (isNaN(volume) || volume < 0 || volume > 100) {
      const errorEmbed = await new PresetEmbed({ member }).init();
      errorEmbed
        .setTitle("❌ Errore")
        .setDescription("Devi inserire un numero valido tra 0 e 100.");
      return { embeds: [errorEmbed], ephemeral: true };
    }

    queue.setVolume(volume);
    const panel = await new NowPlayingPanelBuilder(queue).build();
    await interaction.update(panel);
  },
};
