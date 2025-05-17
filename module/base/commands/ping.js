export default {
  name: "ping",
  permissions: [],
  allowedChannels: true,
  allowedBot: true,
  onlyOwner: false,
  position: false,
  test: false,
  see: true,
  data: {
    name: "ping",
    description: "Test latenza",
  },
  execute: async (interaction) => {
    await interaction.reply("Pong!");
  },
};
