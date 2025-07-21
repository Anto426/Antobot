import BotConsole from "../../../class/console/BotConsole.js";
import HelpMenuBuilder from "../../../class/help/helpBuilder.js";
import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export default {
  name: "help",
  permissions: [],
  isActive: true,
  response: false,

  execute: async (interaction) => {
    const action = interaction.customId.split("-")[2];
    const helpBuilder = new HelpMenuBuilder();

    switch (action) {
      case "command": {
        const selectedValue = interaction.values?.[0];
        if (!selectedValue) return;

        const menu = await helpBuilder.buildCommandMenu(
          interaction,
          selectedValue
        );

        const customIdParts = interaction.customId.split("-");
        const customId = `${customIdParts[0]}-${customIdParts[1]}-main-${
          customIdParts[3] || 0
        }`;

        const backButton = new ButtonBuilder()
          .setCustomId(customId)
          .setEmoji("🔙")
          .setLabel("Indietro")
          .setStyle(ButtonStyle.Danger);

        const components = [new ActionRowBuilder().addComponents(backButton)];

        await interaction.update({
          embeds: [menu.embed],
          components,
        });
        break;
      }
      case "main": {
        const { embed, components } = await helpBuilder.buildMainMenu(
          interaction
        );

        await interaction.update({
          embeds: [embed],
          components: components,
        });

        break;
      }
      default: {
        BotConsole.error("Unknown action in help command");
        break;
      }
    }
  },
};
