import Security from "../../../class/security/security.js";
import BotConsole from "../../../class/console/BotConsole.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import ConfigManager from "../../../class/ConfigManager/ConfigManager.js";

export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  isActive: true,

  async execute(interaction) {
    async function sendEmbed({
      title,
      description,
      type = "info",
      isEphemeral = false,
    }) {
      try {
        const embed = new PresetEmbed({
          guild: interaction.guild,
          member: interaction.member,
        });

        await embed.init(!isEphemeral);

        switch (type) {
          case "error":
            embed.setColor("#e74c3c");
            embed.setThumbnail(
              "https://cdn-icons-png.flaticon.com/512/463/463612.png"
            );
            break;
          case "success":
            embed.setColor("#2ecc71");
            embed.setThumbnail(
              "https://cdn-icons-png.flaticon.com/512/845/845646.png"
            );
            break;
          case "warning":
            embed.setColor("#f1c40f");
            embed.setThumbnail(
              "https://cdn-icons-png.flaticon.com/512/595/595067.png"
            );
            break;
          default:
            embed.setColor("#3498db");
            embed.setThumbnail(
              "https://cdn-icons-png.flaticon.com/512/565/565547.png"
            );
        }

        embed.setMainContent(`**${title}**`, description);

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
        client.buttons.get(interaction.customId?.split("-")[0]);

      if (!command) {
        await sendEmbed({
          title: "Comando non trovato",
          description: "Questo comando non esiste!",
          type: "error",
          isEphemeral: true,
        });
        return;
      }

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
        await sendEmbed({
          title: "Permesso negato",
          description:
            securityError.message ||
            "Non hai i permessi necessari per eseguire questo comando.",
          type: "warning",
          isEphemeral: shouldBeEphemeral,
        });
        return;
      }

      try {
        if (typeof command.response !== "boolean" || command.response) {
          await interaction.deferReply({ ephemeral: shouldBeEphemeral });
        }

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
        await sendEmbed({
          title: "Errore durante l'esecuzione",
          description:
            cmdError.message ||
            "Si è verificato un errore durante l'esecuzione del comando.",
          type: "error",
          isEphemeral: shouldBeEphemeral,
        });
      }
    } catch (fatalError) {
      BotConsole.error(
        `Errore generale: ${fatalError.stack || fatalError.message}`
      );
      await sendEmbed({
        title: "Errore generale",
        description:
          "Si è verificato un errore durante l'esecuzione dell'interazione.",
        type: "error",
        isEphemeral: true,
      });
    }
  },
};
