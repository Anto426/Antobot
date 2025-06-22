import { ApplicationCommandOptionType, PermissionsBitField } from "discord.js";
import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import BotConsole from "../../../../class/console/BotConsole.js";

export default {
    name: "clear",
    permissions: [PermissionsBitField.Flags.ManageMessages],
    isActive: true,
    data: {
        name: "clear",
        description: "Cancella un numero specificato di messaggi da un canale.",
        options: [
            {
                name: "quantità",
                description: "Il numero di messaggi da cancellare (tra 1 e 100).",
                type: ApplicationCommandOptionType.Integer,
                required: true,
                min_value: 1,
                max_value: 100, // Limite imposto dall'API di Discord
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
        await interaction.deferReply({ ephemeral: true });

        const amount = interaction.options.getInteger("quantità");
        const targetUser = interaction.options.getUser("utente");
        const channel = interaction.channel;

        const embed = await new PresetEmbed({ guild: interaction.guild, member: interaction.member }).init();

        // Controllo se il bot ha i permessi nel canale specifico
        if (!channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.ManageMessages)) {
            embed.KDanger("Permessi Mancanti", "Non ho il permesso di `Gestire Messaggi` in questo canale.");
            return interaction.editReply({ embeds: [embed] });
        }

        try {
            // Scarica i messaggi da cancellare
            const messages = await channel.messages.fetch({ limit: amount });

            let messagesToDelete = messages;

            // Se è stato specificato un utente, filtra i messaggi
            if (targetUser) {
                messagesToDelete = messages.filter(m => m.author.id === targetUser.id);
            }

            // Filtra i messaggi più vecchi di 14 giorni, che non possono essere cancellati in massa
            const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
            messagesToDelete = messagesToDelete.filter(m => m.createdTimestamp > fourteenDaysAgo);

            if (messagesToDelete.size === 0) {
                embed.KWarning("Nessun Messaggio da Cancellare", "Non sono stati trovati messaggi recenti (ultimi 14 giorni) che corrispondono ai tuoi criteri.");
                return interaction.editReply({ embeds: [embed] });
            }

            // Esegui la cancellazione di massa
            const deletedMessages = await channel.bulkDelete(messagesToDelete, true);

            let responseDescription = `Ho cancellato con successo **${deletedMessages.size}** messaggi.`;
            if (targetUser) {
                responseDescription += ` inviati da ${targetUser}.`;
            }

            embed.setMainContent("Messaggi Cancellati", responseDescription);
            embed._applyColorFromImage();
            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            BotConsole.error(`[ClearCommand] Errore durante la cancellazione dei messaggi:`, error);
            embed.KDanger("Errore", "Si è verificato un errore durante la cancellazione. I messaggi potrebbero essere troppo vecchi (più di 14 giorni).");
            await interaction.editReply({ embeds: [embed] });
        }
    },
};