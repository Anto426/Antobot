import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import BotConsole from "../../../../class/console/BotConsole.js";

export default {
  name: "clean",
  permissions: [PermissionsBitField.Flags.ManageMessages],
  isActive: true,
  data: {
    name: "clean",
    description: "Cancella un numero specificato di messaggi da un canale.",
    options: [
      {
        name: "quantità",
        description: "Il numero di messaggi da cancellare (tra 1 e 100).",
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 1,
        max_value: 100,
      },
      {
        name: "utente",
        description: "Cancella solo i messaggi di questo utente (opzionale).",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  async execute(interaction) {
    const amount = interaction.options.getInteger("quantità");
    const targetUser = interaction.options.getUser("utente");
    const { channel, client, guild, member } = interaction;

    const embed = await new PresetEmbed({ guild, member }).init();

    if (
      !channel
        .permissionsFor(client.user)
        .has(PermissionsBitField.Flags.ManageMessages)
    ) {
      embed.KDanger(
        "Permessi Mancanti",
        "Non ho il permesso di `Gestire Messaggi` in questo canale."
      );
      return interaction.editReply({ embeds: [embed] });
    }

    try {
      const messages = await channel.messages.fetch({ limit: amount });
      let messagesToDelete = messages;

      if (targetUser) {
        messagesToDelete = messages.filter(
          (m) => m.author.id === targetUser.id
        );
      }

      messagesToDelete = messagesToDelete.filter(
        (m) => m.interaction?.id !== interaction.id
      );

      if (messagesToDelete.size === 0) {
        embed.KWarning(
          "Nessun Messaggio Trovato",
          "Non sono stati trovati messaggi che corrispondono ai tuoi criteri."
        );
        return { embeds: [embed], ephemeral: true };
      }

      const deletedMessages = await channel.bulkDelete(messagesToDelete, true);

      if (deletedMessages.size === 0) {
        embed.KWarning(
          "Nessun Messaggio Cancellato",
          "Non è stato possibile cancellare alcun messaggio. Potrebbero essere più vecchi di 14 giorni."
        );
        return { embeds: [embed], ephemeral: true };
      }

      let responseDescription = `Ho cancellato con successo **${deletedMessages.size}** messaggi.`;
      if (targetUser) {
        responseDescription += ` inviati da ${targetUser}.`;
      }

      embed.setMainContent("Messaggi Cancellati", responseDescription);
      await embed._applyColorFromImage();
      return { embeds: [embed], ephemeral: true };
    } catch (error) {
      BotConsole.error(
        `[CleanCommand] Errore durante la cancellazione dei messaggi:`,
        error
      );
      embed.KDanger(
        "Errore",
        "Si è verificato un errore. I messaggi potrebbero essere troppo vecchi (più di 14 giorni)."
      );
      return { embeds: [embed], ephemeral: true };
    }
  },
};
