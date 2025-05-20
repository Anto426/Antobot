import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import PresetEmbed from "../embed/PresetEmbed.js";
import ConfigManager from "../ConfigManager/ConfigManager.js";
class HelpMenuBuilder {
  buildMainMenu(interaction) {
    const config = ConfigManager.getConfig("description").command;

    const commandOptions = client.commands
      .filter((cmd) => cmd.IsActive && cmd.isVisibleInHelp)
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
      .map((cmd) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(
            `${config.command[cmd.name]?.emoji || "⚙️"} ${cmd.data.name}`
          )
          .setDescription(cmd.data.description)
          .setValue(cmd.data.name)
      );

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`help-${interaction.member.id}-main`)
      .setPlaceholder("Seleziona un comando")
      .addOptions(commandOptions);

    const embed = new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed
      .setMainContent(
        "⚙️ Comandi disponibili",
        "Seleziona un comando dal menu qui sotto per visualizzare i dettagli e le istruzioni di utilizzo."
      )
      .setDescription(
        "Puoi anche digitare `/help <comando>` per ottenere informazioni dettagliate su un comando specifico."
      );

    return { embed, selectMenu };
  }
}

export default HelpMenuBuilder;
