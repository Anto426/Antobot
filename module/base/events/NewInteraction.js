export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  allowevents: true,
  async execute(interaction) {
        
    if (interaction.isChatInputCommand()) {
      interaction.reply("this is a command");
    } else if (interaction.isButton()) {
      interaction.reply("this is a button");
    }
  },
};
