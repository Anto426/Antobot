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
    let embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    let result = await eval(expression);

    embed
      .setMainContent(
        `Esecuzione di: \`${expression}\``,
        `**Risultato:**\n\`\`\`js\n${result}\n\`\`\``
      )
      .setFooter(
        `Richiesto da ${interaction.user.tag}`,
        interaction.user.displayAvatarURL({ size: 512, dynamic: true })
      );
    return { embeds: [embed] };
  },
};
