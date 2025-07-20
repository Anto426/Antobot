import PresetEmbed from "../../../class/embed/PresetEmbed.js";
export default {
  name: "autoplay",
  permissions: [],
  isActive: true,
  isBotAllowed: true,
  isOwnerOnly: false,
  requiresPositionArgument: false,
  isTestCommand: false,
  isVisibleInHelp: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: true,
    requireBotInVoiceChannel: true,
    requireTrackInQueue: true,
  },
  data: {
    name: "autoplay",
    description: "Attiva o disattiva la modalità autoplay",
  },

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction);
    const newAutoplayState = queue.toggleAutoplay();

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    const statoAttuale = newAutoplayState
      ? "✅ **Attivato**"
      : "❌ **Disattivato**";
    const spiegazione = newAutoplayState
      ? "Alla fine della coda, aggiungerò automaticamente brani simili per non interrompere la musica."
      : "Il bot lascerà il canale vocale al termine dell'ultimo brano in coda.";

    embed
      .setTitle("🔁 Impostazioni Autoplay")
      .setThumbnail(
        interaction.client.user.displayAvatarURL({ dynamic: true, size: 512 })
      )
      .setDescription(
        "La modalità di riproduzione automatica è stata aggiornata."
      )
      .addFields(
        {
          name: "Stato Attuale",
          value: statoAttuale,
          inline: true,
        },
        {
          name: "Consiglio",
          value: "Usa di nuovo `/autoplay` per cambiare.",
          inline: true,
        },
        {
          name: "Cosa Succede Ora?",
          value: spiegazione,
          inline: false,
        }
      );

    return { embeds: [embed] };
  },
};
