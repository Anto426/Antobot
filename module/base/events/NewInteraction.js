import Security from "../../../class/Security/security.js";
import BotConsole from "../../../class/console/BotConsole.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import ConfigManager from "../../../class/services/ConfigManager.js";

const EMBED_STYLES = {
  error: { emoji: "❌" },
  success: { emoji: "✅" },
  warning: { emoji: "⚠️" },
  info: { emoji: "ℹ️" },
};

async function sendReply({
  interaction,
  title,
  description,
  type = "info",
  fields,
  payload,
}) {
  if (!interaction || !interaction.isRepliable()) {
    BotConsole.error("sendReply: Interaction non valida o non rispondibile.");
    return;
  }

  const send = async (messagePayload) => {
    if (messagePayload.ephemeral) {
      BotConsole.info(
        "Payload effimero rilevato. Eseguo la logica di cancellazione e follow-up."
      );
      try {
        await interaction.deleteReply();
        BotConsole.success("Risposta precedente cancellata con successo.");

        await interaction.followUp(messagePayload);
      } catch (error) {
        BotConsole.warning(
          `Impossibile cancellare la risposta precedente: ${error.message}. Tento comunque di inviare il followUp.`
        );
        try {
          await interaction.followUp(messagePayload);
        } catch (followUpError) {
          BotConsole.error(
            `Anche il followUp effimero è fallito: ${
              followUpError.stack || followUpError
            }`
          );
        }
      }
    } else {
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply(messagePayload);
        } else {
          await interaction.reply(messagePayload);
        }
      } catch (error) {
        BotConsole.warning(
          `Risposta/modifica standard fallita: ${error.message}. Tento il followUp.`
        );
        try {
          await interaction.followUp(messagePayload);
        } catch (followUpError) {
          BotConsole.error(
            `Anche il followUp di fallback è fallito: ${
              followUpError.stack || followUpError
            }`
          );
        }
      }
    }
  };

  try {
    if (payload) {
      await send(payload);
      return;
    }

    const style = EMBED_STYLES[type] || EMBED_STYLES.info;
    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: interaction.client.user.displayAvatarURL(),
    }).init();

    embed.setTitle(`${style.emoji} ${title}`).setDescription(description);

    if (fields?.length > 0) {
      embed.addFields(fields);
    }

    await send({ embeds: [embed], ephemeral: true });
  } catch (err) {
    BotConsole.error(`Failed to send reply: ${err.stack || err}`);
  }
}

function getHandler(interaction) {
  const { client } = interaction;
  if (interaction.isCommand()) {
    return client.commands.get(interaction.commandName);
  }
  if (
    interaction.isButton() ||
    interaction.isAnySelectMenu() ||
    interaction.isModalSubmit()
  ) {
    const handlerName = interaction.customId.split("-")[0];
    return client.buttons.get(handlerName) || client.commands.get(handlerName);
  }
  return null;
}

async function executeHandler(interaction, handler) {
  const security = new Security(
    interaction,
    handler,
    ConfigManager.getConfig("owner").owner
  );

  const securityResult = await security.allow().catch((err) => err);

  if (securityResult instanceof Error) {
    await sendReply({
      interaction,
      type: "error",
      title: "Accesso Negato",
      description:
        "Non possiedi i permessi necessari per eseguire questa azione.",
      fields: [{ name: "Dettaglio", value: `\`${securityResult.message}\`` }],
      ephemeral: true,
    });
    return;
  }

  const shouldDefer = handler.response !== false;
  if (shouldDefer && !interaction.replied && !interaction.deferred) {
    await interaction.deferReply();
  }

  const args = typeof securityResult === "object" ? securityResult : null;
  const responsePayload = await handler.execute(interaction, args);

  if (
    responsePayload === undefined ||
    responsePayload === null ||
    responsePayload === false ||
    responsePayload === ""
  ) {
    BotConsole.debug(
      `Handler ${handler.name} ha restituito un payload vuoto, non invio risposta.`
    );
    return;
  } else {
    BotConsole.debug(
      `Handler ${handler.name} ha restituito un payload valido, procedo con l'invio.`
    );
    sendReply({
      interaction,
      payload: responsePayload,
    });
  }

  BotConsole.success(
    `Eseguito: ${handler.name} | Utente: ${interaction.user.tag} | Server: ${
      interaction.guild?.name || "DM"
    }`
  );
}

export default {
  name: "NewInteraction",
  eventType: "interactionCreate",
  isActive: true,

  async execute(interaction) {
    if (!client.botready) {
      await sendReply({
        interaction,
        type: "warning",
        title: "⏳ Bot in Avvio",
        description:
          "Il bot non ha ancora completato la sequenza di avvio. Riprova tra qualche istante.",
      });
      return;
    }

    const handler = getHandler(interaction);

    if (!handler) {
      BotConsole.warn(
        `Nessun handler trovato per l'interazione: ${interaction.type} | ${
          interaction.customId || interaction.commandName
        }`
      );
      if (interaction.isRepliable()) {
        await sendReply({
          interaction,
          type: "error",
          title: "❓ Interazione Sconosciuta",
          description:
            "Non è stato trovato un gestore per questa interazione. Potrebbe trattarsi di un componente di un vecchio messaggio.",
          fields: [
            {
              name: "ID Interazione",
              value: `\`${interaction.customId || interaction.commandName}\``,
            },
          ],
        });
      }
      return;
    }

    try {
      await executeHandler(interaction, handler);
    } catch (error) {
      BotConsole.error(
        `Error executing handler '${handler.name}': ${error.stack || error}`
      );
      if (interaction.isRepliable()) {
        await sendReply({
          interaction,
          type: "error",
          title: "🔥 Errore Inaspettato",
          description:
            "Si è verificato un errore critico durante l'esecuzione. L'incidente è stato registrato per la revisione.",
          fields: [
            { name: "Comando", value: `\`/${handler.name}\``, inline: true },
            { name: "ID Errore", value: `\`${interaction.id}\``, inline: true },
            {
              name: "Messaggio",
              value: `\`\`\`${error.message.slice(0, 1000)}\`\`\``,
            },
          ],
        });
      }
    }
  },
};
