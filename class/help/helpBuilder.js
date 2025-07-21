import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import PresetEmbed from "../embed/PresetEmbed.js";
import ConfigManager from "../services/ConfigManager.js";
import Menu from "../row/menu.js";

const FIELD_SEPARATOR = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

class HelpMenuBuilder {
  async buildMainMenu(interaction) {
    const config = ConfigManager.getConfig("description").command;
    const commands = client.commands;

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
          .filter((cmd) => cmd.isVisibleInHelp)
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
      .setCustomId(`help-${interaction.member.id}-command-${interaction.customId.split("-")[3] || 0}`)
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
      `help`,
      selectMenu,
      interaction.member.id,
      "main",
      parseInt(interaction?.customId?.split("-")[3] || "0", 10)
    );

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    embed
      .setTitle("✨ **Lista dei Comandi**")
      .setDescription(
        [
          `🧮 Totale: ${totalCommands}    ✅ Attivi: ${activeCommands.size}`,
          `───────────────────────────────`,
          `❌ Disattivi: ${inactiveCommands.size}    🔒 Solo Owner: ${ownerOnlyCommands.size}`,
          `───────────────────────────────`,
          `⚙️ Con attributi: ${commandsWithOptions.size}    🚫 Senza attributi: ${commandsWithoutOptions.size}`,
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
    const moduleTag = command.moduleTag || "Altro";

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    let optionsText = "Nessun attributo richiesto.";
    if (Array.isArray(command.data?.options) && command.data.options.length) {
      optionsText = command.data.options
        .map((opt) => {
          const isRequired = opt.required
            ? "`🔴 Obbligatorio`"
            : "`🟢 Facoltativo`";

          const typeMap = {
            1: "Testo",
            2: "Numero Intero",
            3: "Testo",
            4: "Utente",
            5: "Ruolo",
            6: "Canale",
            7: "Mentionable",
            8: "Numero Decimale",
            9: "Booleano",
          };
          const typeName =
            typeof opt.type === "number"
              ? typeMap[opt.type] || `Tipo: ${opt.type}`
              : "Tipo sconosciuto";

          return `• \`${opt.name}\` — ${
            opt.description || "Nessuna descrizione"
          }\n   ↳ ${isRequired}, Tipo: \`${typeName}\``;
        })
        .join("\n\n");
    }

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
            `• **Modulo:** \`${moduleTag}\``,
            `• **Attivo:** ${command.isActive ? "✅ Sì" : "❌ No"}`,
            `• **Solo Owner:** ${command.isOwnerOnly ? "🔒 Sì" : "🌐 No"}`,
            `• **Test:** ${command.isTestCommand ? "🧪 Sì" : "❌ No"}`,
          ].join("\n"),
          inline: false,
        },
        {
          name: "🔐 **Permessi Richiesti**",
          value:
            Array.isArray(command.permissions) && command.permissions.length
              ? command.permissions.map((p) => `• \`${p}\``).join("\n")
              : "Nessun permesso richiesto.",
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
