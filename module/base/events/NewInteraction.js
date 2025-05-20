import Security from "../../../class/security/security.js";
import BotConsole from "../../../class/console/BotConsole.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import ConfigManager from "../../../class/ConfigManager/ConfigManager.js";

export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  isActive: true,

  async execute(interaction) {
    async function sendEmbed(title, description, isEphemeral = false) {
      try {
        const embed = new PresetEmbed({
          guild: interaction.guild,
          member: interaction.member,
        });

        await embed.init(!isEphemeral);
        embed.setMainContent(title, description);

        const payload = { embeds: [embed], ephemeral: isEphemeral };

        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply(payload);
        } else if (interaction.deferred && !interaction.replied) {
          await interaction.editReply(payload);
        } else {
          await interaction.followUp(payload);
        }
      } catch (err) {
        BotConsole.error(`sendEmbed failed: ${err.stack || err.message}`);
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

      // Sicurezza e autorizzazioni
      const securityCheck = new Security(
        interaction,
        command,
        ConfigManager.getConfig("owner").owner
      );

      let securityResult;
      let shouldBeEphemeral = false;

      try {
        securityResult = await securityCheck.allow(interaction, command);
      } catch (securityError) {
        shouldBeEphemeral = true;
        BotConsole.error(
          `Permesso negato: ${securityError.stack || securityError.message}`
        );
        await sendEmbed(
          "Permesso negato",
          securityError.message,
          shouldBeEphemeral
        );
        return;
      }

      try {
        await interaction.deferReply({ ephemeral: shouldBeEphemeral });

        const args =
          typeof securityResult !== "boolean" ? securityResult : null;
        await command.execute(interaction, args);

        BotConsole.success(
          `Comando eseguito: ${command.name} | Utente: ${
            interaction.user.tag
          } (${interaction.user.id}) | Guild: ${
            interaction.guild?.name || "DM"
          }`
        );
      } catch (cmdError) {
        shouldBeEphemeral = true;
        BotConsole.error(
          `Errore comando: ${cmdError.stack || cmdError.message}`
        );
        await sendEmbed(
          "Errore durante l'esecuzione",
          cmdError.message,
          shouldBeEphemeral
        );
      }
    } catch (fatalError) {
      BotConsole.error(
        `Errore generale: ${fatalError.stack || fatalError.message}`
      );
      await sendEmbed(
        "Errore generale",
        "Si è verificato un errore durante l'esecuzione dell'interazione.",
        true
      );
    }
  },
};
