import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import PresetEmbed from "../embed/PresetEmbed.js";
import ConfigManager from "../ConfigManager/ConfigManager.js";
import Menu from "../row/menu.js";

const FIELD_SEPARATOR = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

const optionTypeMap = {
  1: "Subcomando",
  2: "Subcomando Gruppo",
  3: "Stringa",
  4: "Intero",
  5: "Booleano",
  6: "Utente",
  7: "Canale",
  8: "Ruolo",
  9: "Mentionable",
  10: "Numero",
  11: "Attacco Utente",
};

class HelpMenuBuilder {
  async buildMainMenu(interaction) {
    const config = ConfigManager.getConfig("description").command;
    const commands = interaction.client.commands;

    const commandsByModule = {};
    commands.forEach((cmd) => {
      const tag = cmd.moduleTag || "Altro";
      if (!commandsByModule[tag]) commandsByModule[tag] = [];
      commandsByModule[tag].push(cmd);
    });

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

    let commandOptions = [];
    Object.keys(commandsByModule)
      .sort()
      .forEach((tag) => {
        const group = commandsByModule[tag]
          .filter((cmd) => cmd.isActive && cmd.isVisibleInHelp)
          .sort((a, b) => a.data.name.localeCompare(b.data.name))
          .map((cmd) => {
            const cmdConfig = config[cmd.name] || {};
            const emoji = cmdConfig.emoji || "🔹";
            const name = String(cmd.data.name || "Sconosciuto");
            let description =
              cmd.data.description || "Nessuna descrizione disponibile";
            if (description.length > 90)
              description = description.slice(0, 87) + "...";
            return {
              label: `${emoji} ${name}`.slice(0, 100),
              description,
              value: name,
              moduleTag: tag,
            };
          });
        if (group.length) {
          commandOptions.push({
            label: `📁 ${tag.toUpperCase()}`,
            description: "──────────────",
            value: `__group__${tag}`,
            isGroup: true,
            default: false,
            emoji: "📁",
          });
          commandOptions = commandOptions.concat(group);
        }
      });

    if (!commandOptions.length) {
      commandOptions.push({
        label: "❌ Nessun comando disponibile",
        description: "Non ci sono comandi da mostrare.",
        value: "no_command",
      });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`help-${interaction.member.id}-main`)
      .setPlaceholder("📂 Seleziona un comando");

    const menu = new Menu();
    const components = menu.createMenu(
      commandOptions
        .filter((opt) => !opt.isGroup)
        .map((opt) =>
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
      .setTitle("✨ **Lista dei Comandi**")
      .setDescription(
        [
          `🧮 Totale: \`${totalCommands}\`   ✅ Attivi: \`${activeCommands.size}\``,
          `❌ Disattivi: \`${inactiveCommands.size}\`   🔒 Solo Owner: \`${ownerOnlyCommands.size}\``,
          `⚙️ Con attributi: \`${commandsWithOptions.size}\`   🚫 Senza attributi: \`${commandsWithoutOptions.size}\``,
          "",
          `**${FIELD_SEPARATOR}**`,
          "",
          "⬇️ **Seleziona un comando dal menu a tendina per vedere i dettagli.**",
          "",
          "**Legenda:**",
          "`✅` Attivo   `🔒` Solo Owner   `⚙️` Con attributi",
          "",
          "I comandi sono raggruppati per modulo 📁.",
        ].join("\n")
      )
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 256 }))
      .setFooter({
        text: `Richiesto da ${
          interaction.user.tag
        } • ${new Date().toLocaleDateString("it-IT")}`,
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
    const command = interaction.client.commands.get(commandName);
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
    const moduleTag = command.moduleTag || "Altro";

    // Costruisco testo attributi con tipi leggibili e stile richiesto
    let optionsText = "Nessun attributo richiesto.";
    if (Array.isArray(command.data?.options) && command.data.options.length) {
      optionsText = command.data.options
        .map((opt) => {
          const isRequired = opt.required
            ? "`🔴 Obbligatorio`"
            : "`🟢 Facoltativo`";
          const typeName =
            optionTypeMap[opt.type] || `Tipo sconosciuto (${opt.type})`;
          return `• \`${opt.name}\` — ${
            opt.description || "Nessuna descrizione"
          }\n  ↳ ${isRequired}, Tipo: ${typeName}`;
        })
        .join("\n\n");
    }

    // Permessi come elenco
    let permissionsText =
      Array.isArray(command.permissions) && command.permissions.length
        ? command.permissions.map((p) => `• \`${p}\``).join("\n")
        : "Nessun permesso richiesto.";

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed
      .setTitle(`${emoji} **Comando \`/${name}\`** 〔${moduleTag}〕`)
      .setDescription(
        [
          `> **📄 Descrizione:** ${description}`,
          "",
          `> 🛠️ **Utilizzo:** \`/${name}\``,
          "",
          `**${FIELD_SEPARATOR}**`,
        ].join("\n")
      )
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 256 }))
      .addFields(
        {
          name: "⚙️ **Dettagli**",
          value: [
            `Modulo: \`${moduleTag}\``,
            `Attivo: ${command.isActive ? "✅ Sì" : "❌ No"}`,
            `Solo Owner: ${command.isOwnerOnly ? "🔒 Sì" : "🌐 No"}`,
            `Test: ${command.isTestCommand ? "🧪 Sì" : "❌ No"}`,
          ].join("\n"),
          inline: false,
        },
        {
          name: "🔐 **Permessi Richiesti**",
          value: permissionsText,
          inline: true,
        },
        {
          name: "📝 **Attributi Richiesti**",
          value: optionsText,
          inline: false,
        }
      )
      .setFooter({
        text: `Comando: /${name} • Modulo: ${moduleTag} • Utente: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    return { embed };
  }
}

export default HelpMenuBuilder;
