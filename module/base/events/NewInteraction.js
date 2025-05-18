import Security from "../../../class/security/security.js";
import BotConsole from "../../../class/console/BotConsole.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import ConfigManager from "../../../class/ConfigManager/ConfigManager.js";

export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  allowevents: true,

  async execute(interaction) {
    async function sendEmbed(title, description, ephemeral = false) {
      try {
        const embed = new PresetEmbed({
          guild: interaction.guild,
          member: interaction.member,
        });
        await embed.init(!ephemeral);
        embed.setMainContent(title, description);

        const payload = { embeds: [embed], ephemeral };

        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply(payload);
        } else if (interaction.deferred && !interaction.replied) {
          await interaction.editReply(payload);
        } else {
          await interaction.followUp(payload);
        }
      } catch (sendErr) {
        BotConsole.error(
          `sendEmbed failed: ${sendErr.stack || sendErr.message}`
        );
      }
    }

    try {
      const command =
        client.commands.get(interaction.commandName) ||
        client.buttons.get(interaction.commandName);

      if (!command) {
        await sendEmbed(
          "Comando non trovato",
          "Questo comando non esiste!",
          true
        );
        return;
      }

      const securityCheck = new Security(
        interaction,
        command,
        ConfigManager.getConfig("owner").owner
      );

      let securityResult;

      try {
        securityResult = await securityCheck.allow(interaction, command);
      } catch (securityError) {
        BotConsole.error(
          `Permesso negato: ${securityError.stack || securityError.message}`
        );
        await sendEmbed("Permesso negato", securityError.message, true);
        return;
      }

      try {
        if (!interaction.deferred && !interaction.replied) {
          await interaction.deferReply();
        }

        const arg = typeof securityResult !== "boolean" ? securityResult : null;
        await command.execute(interaction, arg);

        BotConsole.success(
          `Comando eseguito: ${command.name} | Utente: ${
            interaction.user.tag
          } (${interaction.user.id}) | Guild: ${
            interaction.guild?.name || "DM"
          }`
        );
      } catch (cmdError) {
        BotConsole.error(
          `Errore esecuzione comando: ${cmdError.stack || cmdError.message}`
        );
        await sendEmbed("Errore durante l'esecuzione", cmdError.message, true);
      }
    } catch (error) {
      BotConsole.error(
        `Errore generale in NewInteraction: ${error.stack || error.message}`
      );
      await sendEmbed(
        "Errore generale",
        "Si è verificato un errore durante l'esecuzione dell'interazione!",
        true
      );
    }
  },
};
