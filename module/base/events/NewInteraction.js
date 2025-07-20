import Security from "../../../class/security/security.js";
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
  footer,
  payload,
}) {
  if (!interaction || !interaction.isRepliable()) {
    BotConsole.error(
      "sendReply was called with an invalid or non-repliable interaction."
    );
    return;
  }

  const send = async (messagePayload) => {
    try {
      if (interaction.replied || interaction.deferred) {
        if (!messagePayload.ephemeral) {
          await interaction.editReply(messagePayload);
        } else {
          BotConsole.warning(
            "Interaction is ephemeral, using followUp instead of editReply."
          );
          try {
            await interaction.deleteReply();
            await new Promise((resolve) => setTimeout(resolve, 500));
            await interaction.followUp(messagePayload);
          } catch (fallbackErr) {
            BotConsole.error(
              `Fallback reply after delete failed: ${
                fallbackErr.stack || fallbackErr
              }`
            );
          }
        }
      } else {
        await interaction.reply(messagePayload);
      }
    } catch (error) {
      BotConsole.warning(
        `Initial reply failed. Trying followUp. Error: ${error.message}`
      );
      await interaction
        .followUp(messagePayload)
        .catch((err) =>
          BotConsole.error(`Follow-up reply also failed: ${err.stack || err}`)
        );
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

    // Il footer viene ora gestito automaticamente dalla classe PresetEmbed
    // Non è più necessario impostarlo qui manualmente

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
    return client.buttons.get(handlerName);
  }
  return null;
}

async function executeHandler(interaction, handler) {
  const isEphemeral = handler.isEphemeral || false;

  const security = new Security(
    interaction,
    handler,
    ConfigManager.getConfig("owner").owner
  );

  const securityResult = await security.allow().catch((err) => {
    return err;
  });

  if (securityResult instanceof Error) {
    await sendReply({
      interaction,
      title: "Permesso Negato",
      description:
        securityResult?.message || "Non hai il permesso di fare questo.",
      type: "warning",
      isEphemeral: true,
    });
    return;
  }

  const shouldDefer = handler.response !== false;
  if (shouldDefer && !interaction.replied && !interaction.deferred) {
    await interaction.deferReply({ ephemeral: isEphemeral });
  }

  const args = typeof securityResult === "object" ? securityResult : null;
  const responsePayload = await handler.execute(interaction, args);

  if (responsePayload) {
    await sendReply({
      interaction,
      payload: responsePayload,
    });
  }

  BotConsole.success(
    `Handler executed: ${handler.name} | User: ${
      interaction.user.tag
    } | Guild: ${interaction.guild?.name || "DM"}`
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
        title: "Bot Non Pronto",
        description: "Il bot non è ancora pronto. Riprova tra qualche istante.",
        type: "warning",
      });
      return;
    }

    const handler = getHandler(interaction);

    if (!handler) {
      BotConsole.warn(
        `No handler found for interaction: ${interaction.type} | ${
          interaction.customId || interaction.commandName
        }`
      );
      if (interaction.isRepliable()) {
        await sendReply({
          interaction,
          title: "Unknown Interaction",
          description:
            "Questa interazione è sconosciuta. Potrebbe essere stata rimossa o non esiste.",
          type: "error",
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
          title: "Si è verificato un errore",
          description:
            "Si è verificato un errore durante l'esecuzione di questo comando. Controlla i log per maggiori dettagli.",
          type: "error",
        });
      }
    }
  },
};
