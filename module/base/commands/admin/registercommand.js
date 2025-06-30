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
    let embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();
    await Promise.allSettled([promise])
      .then((results) => {
        let successCount = results.filter(
          (r) => r.status === "fulfilled" && r.value === 0
        ).length;
        if (successCount > 0) {
          embed.setMainContent(
            "Comandi aggiornati con successo!",
            `Tutti i comandi sono stati registrati correttamente in tutte le gilde.`
          );
        } else {
          embed.setMainContent(
            "Errore durante l'aggiornamento dei comandi",
            `Si è verificato un errore durante la registrazione dei comandi.`
          );
        }
      })
      .catch((error) => {
        embed.setMainContent(
          "Errore durante l'aggiornamento dei comandi",
          `Si è verificato un errore: ${error.message}`
        );
      });
    return { embeds: [embed] };
  },
};
