import Security from "../../../class/security/security.js";
import BotConsole from "../../../class/console/BotConsole.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import ConfigManager from "../../../class/ConfigManager/ConfigManager.js";

async function respondToInteraction(
  interaction,
  payload,
  isInitialResponseAttempt = false
) {
  try {
    if (isInitialResponseAttempt) {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply(payload);
        return;
      }
    }

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(payload);
    } else {

      BotConsole.warn(
        `[NewInteraction] Tentativo di followUp per interazione non deferred/replied: ${interaction.id}`
      );
      await interaction.followUp(payload);
    }
  } catch (err) {
    BotConsole.error(
      `[NewInteraction] respondToInteraction fallito (ID: ${
        interaction.id
      }, Comando: ${interaction.commandName || interaction.customId}):`,
      err
    );
    // Non si può fare molto se anche la risposta di errore fallisce
  }
}

export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  isActive: true,

  async execute(interaction) {
    // Passa client se non è globale
    const commandName = interaction.isCommand()
      ? interaction.commandName
      : interaction.isButton()
      ? interaction.customId.split("-")[0]
      : interaction.isStringSelectMenu()
      ? interaction.customId.split("-")[0]
      : "unknown_interaction_type";

    const command =
      client.commands.get(commandName) ||
      client.buttons.get(commandName) ||
      client.selectMenus.get(commandName); // Aggiungi selectMenus se li usi

    if (!command) {
      BotConsole.warn(
        `[NewInteraction] Comando/Componente non trovato per: ${commandName} (ID: ${interaction.id})`
      );
      if (interaction.isRepliable()) {
        // Controlla se si può rispondere
        const embed = new PresetEmbed({
          guild: interaction.guild,
          member: interaction.member,
        });
        await embed.init(false); // No dynamic color per un errore veloce
        embed.KDanger(
          "Comando Non Trovato",
          "Il comando o l'azione richiesta non è stata trovata."
        );
        await respondToInteraction(
          interaction,
          { embeds: [embed], ephemeral: true },
          true
        );
      }
      return;
    }

    // Determina se la risposta del comando dovrebbe essere effimera di default
    // Puoi basarti su una proprietà del comando, es. command.isEphemeral
    const isCommandEphemeral =
      command.isEphemeral !== undefined ? command.isEphemeral : true; // Default a true se non specificato

    // --- DEFER REPLY ---
    // Deve essere fatto il prima possibile, PRIMA di controlli di sicurezza lunghi o esecuzione del comando
    let deferredSuccessfully = false;
    if (interaction.isRepliable()) {
      // Non tutti i tipi di interazione (es. autocomplete) necessitano/supportano deferReply per messaggi visibili
      if (
        interaction.isCommand() ||
        interaction.isButton() ||
        interaction.isStringSelectMenu() ||
        interaction.isModalSubmit()
      ) {
        try {
          BotConsole.debug(
            `[NewInteraction] Tentativo di deferReply per ${command.name} (ID: ${interaction.id}) Ephemeral: ${isCommandEphemeral}`
          );
          await interaction.deferReply({ ephemeral: isCommandEphemeral });
          deferredSuccessfully = true;
          BotConsole.debug(
            `[NewInteraction] DeferReply per ${command.name} (ID: ${interaction.id}) riuscito.`
          );
        } catch (deferError) {
          BotConsole.error(
            `[NewInteraction] Fallito deferReply per ${command.name} (ID: ${interaction.id}). Errore:`,
            deferError
          );
          // Se deferReply fallisce (es. "Unknown Interaction" perché troppo tardi),
          // non possiamo più rispondere in modo affidabile. Logga e esci.
          return;
        }
      }
    } else {
      BotConsole.debug(
        `[NewInteraction] Interazione ${command.name} (ID: ${interaction.id}, Tipo: ${interaction.type}) non è repliable o non necessita di defer.`
      );
      // Per Autocomplete, non si fa deferReply per messaggi.
      // Per altri tipi, potresti doverli gestire diversamente.
    }

    // --- ESECUZIONE COMANDO ---
    try {
      // Controlli di Sicurezza
      // Se securityCheck è asincrono e lungo, il deferReply *deve* avvenire prima!
      const securityCheck = new Security(
        interaction,
        command,
        ConfigManager.getConfig("owner")?.owner // Aggiunto optional chaining
      );

      // Il metodo allow dovrebbe lanciare un errore se non permesso
      // o restituire argomenti elaborati se necessario
      const processedArgs = await securityCheck.allow(); // Rimosso interaction e command, dato che sono nel costruttore

      BotConsole.debug(
        `[NewInteraction] Controlli di sicurezza per ${command.name} (ID: ${interaction.id}) superati.`
      );

      // Esegui il comando
      await command.execute(interaction, processedArgs, client); // Passa client se il comando ne ha bisogno

      // Il comando stesso ora è responsabile di chiamare interaction.editReply() se è stato fatto defer.
      // Se il comando gestisce le proprie risposte, non facciamo nulla qui.
      // Questo log di successo è più per tracciare che il comando è stato invocato.
      BotConsole.success(
        `Comando ${command.name} (ID: ${
          interaction.id
        }) invocato con successo | Utente: ${interaction.user.tag} | Gilda: ${
          interaction.guild?.name || "DM"
        }`
      );
    } catch (executionError) {
      BotConsole.error(
        `[NewInteraction] Errore durante l'esecuzione o i controlli di sicurezza per ${command.name} (ID: ${interaction.id}):`,
        executionError // Logga l'errore completo con stack trace
      );

      if (interaction.isRepliable()) {
        // Controlla di nuovo se si può rispondere
        const embed = new PresetEmbed({
          guild: interaction.guild,
          member: interaction.member,
        });
        await embed.init(false); // No dynamic color

        const errorMessageContent = executionError.isUserFacingError
          ? executionError.message
          : "Si è verificato un errore interno durante l'elaborazione del tuo comando.";
        embed.KDanger("Errore Comando", errorMessageContent);

        await respondToInteraction(interaction, {
          embeds: [embed],
          ephemeral: isCommandEphemeral,
          components: [],
        });
      }
    }
  },
};
