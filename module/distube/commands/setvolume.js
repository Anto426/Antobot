import { ApplicationCommandOptionType } from "discord.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "setvolume",
  permissions: [],
  allowedChannels: true,
  allowedBot: true,
  onlyOwner: false,
  position: false,
  test: false,
  see: true,
  disTube: {
    checkchannel: true,
    checklisttrack: true,
  },
  data: {
    name: "setvolume",
    description: "Imposta il volume della riproduzione (0–100)",
    options: [
      {
        name: "volume",
        description: "Valore del volume da 0 a 100",
        type: ApplicationCommandOptionType.Integer,
        required: true,
        minValue: 0,
        maxValue: 100,
      },
    ],
  },

  async execute(interaction) {
    const volume = interaction.options.getInteger("volume");
    // setVolume restituisce la queue aggiornata
    const queue = await global.distube.setVolume(interaction.guildId, volume);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: queue.songs[0]?.thumbnail,
    }).init();

    const barLength = 10;
    const filledUnits = Math.round((queue.volume / 100) * barLength);
    const emptyUnits = barLength - filledUnits;
    const volumeBar = "▇".repeat(filledUnits) + "—".repeat(emptyUnits);

    embed
      .setColor("#5865F2") // colore Discord blurple
      .setTitle("🔊 Volume Aggiornato")
      .setDescription(`**${queue.volume}%**\n\`${volumeBar}\``) // mostra la barra
      .setThumbnail(queue.songs[0]?.thumbnail) // miniatura del brano corrente
      .addFields({
        name: "🎶 Brano in riproduzione",
        value: queue.songs[0]
          ? `[${queue.songs[0].name}](${queue.songs[0].url})`
          : "Nessun brano in coda",
        inline: false,
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
