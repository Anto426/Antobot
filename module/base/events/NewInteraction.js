import Security from "../../../class/security/security.js";
import BotConsole from "../../../class/console/BotConsole.js";

export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  allowevents: true,

  async execute(interaction) {
    try {
      const command =
        client.commands.get(interaction.commandName) ||
        client.buttons.get(interaction.commandName);

      const securityCheck = new Security(interaction, command);

      if (!command) {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: "Questo comando non esiste!",
            ephemeral: true,
          });
        }
        return;
      }

      try {
        await securityCheck.allow(interaction, command);
      } catch (securityError) {
        BotConsole.error(`NewInteraction.execute(): ${securityError.message}`);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: securityError.message,
            ephemeral: true,
          });
        }
        return;
      }

      try {
        await command.execute(interaction);
      } catch (cmdError) {
        BotConsole.error(`NewInteraction.execute(): ${cmdError.message}`);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: cmdError.message,
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      BotConsole.error(
        `NewInteraction.execute(): Errore generale: ${error.message}`
      );
      if (!interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({
            content:
              "Si è verificato un errore durante l'esecuzione dell'interazione!",
            ephemeral: true,
          });
        } catch (replyError) {
          BotConsole.error(`NewInteraction.execute(): ${replyError.message}`);
        }
      }
    }
  },
};
