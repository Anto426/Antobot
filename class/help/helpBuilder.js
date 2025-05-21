import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from "discord.js";
import PresetEmbed from "../embed/PresetEmbed.js";
import ConfigManager from "../ConfigManager/ConfigManager.js";
import Menu from "../row/menu.js";

class HelpMenuBuilder {
  async buildMainMenu(interaction) {
    const config = ConfigManager.getConfig("description").command;
    const commands = client.commands.filter(
      (cmd) => cmd.isActive && cmd.isVisibleInHelp
    );

    const commandOptions = commands
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
      .map((cmd) => {
        const cmdConfig = config[cmd.name] || {};
        const emoji = cmdConfig.emoji || "❓";
        const name = String(cmd.data.name || "Sconosciuto");
        let description =
          cmd.data.description || "Nessuna descrizione disponibile";
        if (description.length > 100)
          description = description.slice(0, 97) + "...";

        return {
          label: `${emoji} ${name}`.slice(0, 100),
          description,
          value: name,
        };
      });

    if (!commandOptions.length) {
      commandOptions.push({
        label: "Nessun comando disponibile",
        description: "Non ci sono comandi da mostrare.",
        value: "no_command",
      });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`help-${interaction.member.id}-main`)
      .setPlaceholder("Seleziona un comando");

    const menu = new Menu();
    const components = menu.createMenu(
      commandOptions.map((opt) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(opt.label)
          .setDescription(opt.description)
          .setValue(opt.value)
      ),
      `help-${interaction.member.id}-main`,
      selectMenu,
      interaction.member.id,
      "main",
      0
    );

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed.setMainContent(
      "📜 Lista dei Comandi",
      "Seleziona un comando dal menu a tendina per visualizzarne i dettagli."
    );

    return {
      embed: embed,
      components: components.map((c) => (c.toJSON ? c.toJSON() : c)),
    };
  }

  async buildCommandMenu(interaction, command) {
    const config = ConfigManager.getConfig("description").command;
    const cmdConfig = config[command] || {};
    const emoji = cmdConfig.emoji || "❓";
    const name = String(command || "Sconosciuto");
    const description = cmdConfig.description || command;
    const thumbnail = cmdConfig.image;

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed
      .setMainContent(
        `${emoji} ${name}`,
        `Descrizione: ${description}\n\nUtilizza il comando con \`/${name}\``
      )
      .setThumbnailUrl(thumbnail);

    return {
      embed: embed,
    };
  }
}

export default HelpMenuBuilder;
