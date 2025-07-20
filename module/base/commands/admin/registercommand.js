import PresetEmbed from "../../../../class/embed/PresetEmbed.js";
import CommandGuildUpdate from "../../../../class/Guild/CommandGuildUpdate.js";

export default {
  name: "registercommand",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: false,
  data: {
    name: "registercommand",
    description: "Forza la sincronizzazione dei comandi",
  },
  execute: async (interaction) => {
    let promise = CommandGuildUpdate.updateAllGuilds();
    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    try {
      const results = await Promise.allSettled([promise]);
      const successCount = results.filter(
        (r) => r.status === "fulfilled" && r.value === 0
      ).length;

      if (successCount > 0) {
        embed
          .setTitle("✅ Comandi Aggiornati")
          .setThumbnail(interaction.client.user.displayAvatarURL())
          .setDescription(
            "I comandi slash globali sono stati registrati con successo."
          )
          .addFields({
            name: "Stato",
            value: "Operazione completata.",
            inline: true,
          });
      } else {
        const failureReason = results.find(
          (r) => r.status === "rejected"
        )?.reason;
        embed
          .setTitle("❌ Errore di Registrazione")
          .setDescription("Non è stato possibile registrare i comandi slash.")
          .addFields({
            name: "Dettagli Errore",
            value: failureReason
              ? `\`\`\`${failureReason}\`\`\``
              : "Nessun dettaglio disponibile.",
            inline: false,
          });
      }
    } catch (error) {
      embed
        .setTitle("❌ Errore Critico")
        .setDescription(
          "Si è verificato un errore imprevisto durante l'operazione."
        )
        .addFields({
          name: "Messaggio di Errore",
          value: `\`\`\`${error.message}\`\`\``,
          inline: false,
        });
    }

    return { embeds: [embed] };
  },
};
