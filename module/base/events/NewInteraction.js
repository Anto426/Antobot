export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  allowevents: true,
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
          return interaction.reply({ 
            content: 'Command not found!', 
            ephemeral: true 
          });
        }
        await command.execute(interaction);
      } 
      else if (interaction.isButton()) {
        const [customId] = interaction.customId.split('_');
        const button = interaction.client.buttons.get(customId);
        if (!button) {
          return interaction.reply({ 
            content: 'Button handler not found!', 
            ephemeral: true 
          });
        }
        await button.execute(interaction);
      }
      else if (interaction.isSelectMenu()) {
        const [customId] = interaction.customId.split('_');
        const menu = interaction.client.selectMenus.get(customId);
        if (!menu) {
          return interaction.reply({ 
            content: 'Select menu handler not found!', 
            ephemeral: true 
          });
        }
        await menu.execute(interaction);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        content: 'There was an error executing this interaction!', 
        ephemeral: true 
      }).catch(console.error);
    }
  },
};
