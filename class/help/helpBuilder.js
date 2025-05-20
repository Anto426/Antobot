import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import PresetEmbed from "../embed/PresetEmbed.js";
import ConfigManager from "../ConfigManager/ConfigManager.js";
import BotConsole from "../console/BotConsole.js";

class HelpMenuBuilder {
  async buildMainMenu(interaction) {
    const config = ConfigManager.getConfig("description")?.command || {};
    const commands = client.commands.filter(
      (cmd) => cmd.isActive && cmd.isVisibleInHelp
    );

    const commandOptions = commands
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
      .map((cmd) => {
        const name = cmd.data?.name?.trim();
        if (!name) return null;

        const cmdConfig = config[name] || {};
        const emoji = cmdConfig.emoji?.trim() || "⚙️";
        const description = cmdConfig.description?.trim();

        if (!description) return null;

        BotConsole.debug(`Comando visibile nel menu: ${name}`);

        return new StringSelectMenuOptionBuilder()
          .setLabel(`${emoji} ${name}`)
          .setDescription(description)
          .setValue(name);
      })
      .filter(Boolean); // Rimuove i nulli

    // Se nessun comando è disponibile
    if (commandOptions.length === 0) {
      commandOptions.push(
        new StringSelectMenuOptionBuilder()
          .setLabel("Nessun comando disponibile")
          .setDescription("Non ci sono comandi da mostrare.")
          .setValue("no_command")
      );
    }

    BotConsole.debug("Opzioni del menu di aiuto:", commandOptions.map(opt => opt.data));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`help-${interaction.member.id}-main`)
      .setPlaceholder("Seleziona un comando")
      .addOptions(commandOptions);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed.setMainContent(
      "📜 Lista dei Comandi",
      "Seleziona un comando dal menu a tendina per visualizzarne i dettagli."
    );

    return {
      embed,
      selectMenu,
    };
  }
}

export default HelpMenuBuilder;
