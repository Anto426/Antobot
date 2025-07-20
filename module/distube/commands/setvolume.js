import { ApplicationCommandOptionType } from "discord.js";
import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "setvolume",
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
    requireBotInVoiceChannel: false,
    requireTrackInQueue: true,
    requireAdditionalTracks: false,
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireSeekable: false,
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
    const queue = await global.distube.setVolume(interaction.guildId, volume);

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
      image: queue.songs[0]?.thumbnail,
    }).init();

    const barLength = 12;
    const filledUnits = Math.round((queue.volume / 100) * barLength);
    const emptyUnits = barLength - filledUnits;
    const volumeBar = `**\`${"█".repeat(filledUnits)}${"-".repeat(
      emptyUnits
    )}\`**`;

    const currentSong = queue.songs[0];

    embed
      .setTitle(`🔊 Volume Impostato al ${queue.volume}%`)
      .setThumbnail(currentSong?.thumbnail)
      .setDescription(
        `Il volume per **[${currentSong?.name ?? "la traccia attuale"}](${
          currentSong?.url
        })** è stato aggiornato.\n${volumeBar}`
      );

    return { embeds: [embed] };
  },
};
