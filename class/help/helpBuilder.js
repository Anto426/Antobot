import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import PresetEmbed from "../embed/PresetEmbed.js";
import ConfigManager from "../ConfigManager/ConfigManager.js";
import Menu from "../row/menu.js";

const FIELD_SEPARATOR = "━━━━━━━━━━━━━━━━━━━━";

class HelpMenuBuilder {
  async buildMainMenu(interaction) {
    const config = ConfigManager.getConfig("description").command;
    const commands = client.commands;

    // Filtri e conteggi
    const totalCommands = commands.size;
    const activeCommands = commands.filter((cmd) => cmd.isActive);
    const inactiveCommands = commands.filter((cmd) => !cmd.isActive);
    const ownerOnlyCommands = commands.filter((cmd) => cmd.isOwnerOnly);
    const commandsWithOptions = commands.filter(
      (cmd) => Array.isArray(cmd.data?.options) && cmd.data.options.length > 0
    );
    const commandsWithoutOptions = commands.filter(
      (cmd) =>
        !Array.isArray(cmd.data?.options) || cmd.data.options.length === 0
    );

    // Opzioni menu a tendina
    const commandOptions = commands
      .filter((cmd) => cmd.isActive && cmd.isVisibleInHelp)
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

    embed
      .setTitle("📜 Lista dei Comandi")
      .setDescription(
        [
          `**Totale comandi:** \`${totalCommands}\``,
          `✅ **Attivi:** \`${activeCommands.size}\` | ❌ **Disattivi:** \`${inactiveCommands.size}\``,
          `🔒 **Solo Owner:** \`${ownerOnlyCommands.size}\``,
          `⚙️ **Con attributi:** \`${commandsWithOptions.size}\` | 🚫 **Senza attributi:** \`${commandsWithoutOptions.size}\``,
          "",
          FIELD_SEPARATOR,
          "Seleziona un comando dal menu a tendina per visualizzarne i dettagli.",
          "",
          "**Legenda:**",
          "✅ Attivo | 🔒 Solo Owner | ⚙️ Con attributi",
        ].join("\n")
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({
        text: `Richiesto da ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    return {
      embed,
      components: components.map((c) =>
        typeof c.toJSON === "function" ? c.toJSON() : c
      ),
    };
  }

  async buildCommandMenu(interaction, commandName) {
    const command = client.commands.get(commandName);
    if (!command) {
      const embed = await new PresetEmbed({
        guild: interaction.guild,
        member: interaction.member,
      }).init();
      embed
        .setTitle("❌ Comando non trovato")
        .setDescription("Il comando richiesto non esiste.")
        .setFooter({
          text: `Richiesto da ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });
      return { embed };
    }

    const config = ConfigManager.getConfig("description").command;
    const cmdConfig = config[commandName] || {};
    const emoji = cmdConfig.emoji || "🔹";
    const description =
      cmdConfig.description ||
      command.data?.description ||
      "Nessuna descrizione disponibile.";
    const name = String(commandName || "Sconosciuto");

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    // Attributi / opzioni
    let optionsText = "Nessun attributo richiesto.";
    if (Array.isArray(command.data?.options) && command.data.options.length) {
      optionsText = command.data.options
        .map((opt) => {
          const isRequired = opt.required
            ? "🔴 Obbligatorio"
            : "🟢 Facoltativo";
          const type =
            typeof opt.type === "number"
              ? `Tipo: \`${opt.type}\``
              : "Tipo sconosciuto";
          return `• \`${opt.name}\` - ${
            opt.description || "Nessuna descrizione"
          }\n   ↳ ${isRequired}, ${type}`;
        })
        .join("\n\n");
    }

    embed
      .setTitle(`${emoji} Comando \`/${name}\``)
      .setDescription(
        [
          `**📄 Descrizione:** ${description}`,
          "",
          `🔧 Usa con: \`/${name}\``,
          "",
          FIELD_SEPARATOR,
        ].join("\n")
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        {
          name: "⚙️ Dettagli",
          value: [
            `**Attivo:** ${command.isActive ? "✅ Sì" : "❌ No"}`,
            `**Solo Owner:** ${command.isOwnerOnly ? "🔒 Sì" : "🌐 No"}`,
            `**Test:** ${command.isTestCommand ? "🧪 Sì" : "❌ No"}`,
          ].join("\n"),
          inline: false,
        },
        {
          name: "🔐 Permessi Richiesti",
          value:
            Array.isArray(command.permissions) && command.permissions.length
              ? command.permissions.map((p) => `• \`${p}\``).join("\n")
              : "Nessun permesso richiesto.",
          inline: true,
        },
        {
          name: "📝 Attributi Richiesti",
          value: optionsText,
          inline: false,
        }
      )
      .setFooter({
        text: `Comando: /${name} • Utente: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    return { embed };
  }
}

export default HelpMenuBuilder;
