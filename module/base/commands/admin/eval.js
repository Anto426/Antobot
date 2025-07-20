import PresetEmbed from "../../../../class/embed/PresetEmbed.js";

export default {
  name: "eval",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: false,
  data: {
    name: "eval",
    description: "Esegue un'espressione JavaScript",
    options: [
      {
        name: "espressione",
        description: "L'espressione da eseguire",
        type: 3,
        required: true,
      },
    ],
  },
  execute: async (interaction) => {
    const expression = interaction.options.getString("espressione");

    let result = await eval(expression);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    const resultString =
      typeof result === "object" && result !== null
        ? JSON.stringify(result, null, 2)
        : String(result);

    const maxLen = 1000;
    const cleanResult =
      resultString.length > maxLen
        ? resultString.substring(0, maxLen) + "..."
        : resultString;

    embed.setTitle("✅ Valutazione Eseguita").addFields(
      {
        name: "Input 📥",
        value: `\`\`\`js\n${expression}\n\`\`\``,
        inline: false,
      },
      {
        name: "Output 📤",
        value: `\`\`\`js\n${cleanResult}\n\`\`\``,
        inline: false,
      },
      {
        name: "Tipo Restituito",
        value: `\`${typeof result}\``,
        inline: true,
      }
    );

    return { embeds: [embed] };
  },
};
