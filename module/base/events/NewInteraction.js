import Security from "../../../class/security/security.js";
import BotConsole from "../../../class/console/BotConsole.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  allowevents: true,

  async execute(interaction) {
    try {
      const command =
        client.commands.get(interaction.commandName) ||
        client.buttons.get(interaction.commandName);

      if (!command) {
        if (!interaction.replied && !interaction.deferred) {
          const embed = new PresetEmbed({
            guild: interaction.guild,
            member: interaction.member,
          });
          await embed.init();
          embed.setMainContent(
            "Comando non trovato",
            "Questo comando non esiste!"
          );
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        return;
      }

      const securityCheck = new Security(interaction, command);

      try {
        await securityCheck.allow(interaction, command);
      } catch (securityError) {
        BotConsole.error(`NewInteraction.execute(): ${securityError.message}`);

        if (!interaction.replied && !interaction.deferred) {
          const embed = new PresetEmbed({
            guild: interaction.guild,
            member: interaction.member,
          });
          await embed.init();
          embed.setMainContent("Permesso negato", securityError.message);
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        return;
      }

      try {
        await interaction.deferReply();
        await command.execute(interaction,);
      } catch (cmdError) {
        BotConsole.error(`NewInteraction.execute(): ${cmdError.message}`);

        if (!interaction.replied && !interaction.deferred) {
          const embed = new PresetEmbed({
            guild: interaction.guild,
            member: interaction.member,
          });
          await embed.init();
          embed.setMainContent("Errore durante l'esecuzione", cmdError.message);
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      }
    } catch (error) {
      BotConsole.error(
        `NewInteraction.execute(): Errore generale: ${error.message}`
      );
      if (!interaction.replied && !interaction.deferred) {
        try {
          const embed = new PresetEmbed({
            guild: interaction.guild,
            member: interaction.member,
          });
          await embed.init();
          embed.setMainContent(
            "Errore generale",
            "Si è verificato un errore durante l'esecuzione dell'interazione!"
          );
          await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (replyError) {
          BotConsole.error(`NewInteraction.execute(): ${replyError.message}`);
        }
      }
    }
  },
};
