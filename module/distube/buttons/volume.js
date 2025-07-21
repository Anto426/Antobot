import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export default {
  name: "volume",
  permissions: [],
  isActive: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: true,
    requireTrackInQueue: true,
  },
  response: false,
  async execute(interaction) {
    const queue = global.distube.getQueue(interaction.guild);

    const modal = new ModalBuilder()
      .setCustomId(`setvolume-${interaction.user.id}`)
      .setTitle("Imposta Volume");

    const volumeInput = new TextInputBuilder()
      .setCustomId("volumeInput")
      .setLabel("Nuovo volume (da 0 a 100)")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`Valore attuale: ${queue.volume}%`)
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(3);

    const actionRow = new ActionRowBuilder().addComponents(volumeInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  },
};
