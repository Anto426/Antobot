import HelpMenuBuilder from "../../../../class/help/helpBuilder.js";

export default {
  name: "help",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: false,
  data: {
    name: "help",
    description: "Mostra la lista dei comandi disponibili",
  },
  execute: async (interaction) => {
    const helpBuilder = new HelpMenuBuilder();
    const { embed, components } = await helpBuilder.buildMainMenu(interaction);

    return({
      embeds: [embed],
      components: components,
    });
  },
};
