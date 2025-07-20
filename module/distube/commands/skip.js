import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "skip",
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
    requireAdditionalTracks: true,
    disallowIfPaused: false,
    disallowIfPlaying: false,
    requireSeekable: false,
  },
  data: {
    name: "skip",
    description: "Salta la traccia corrente",
  },
  async execute(interaction) {
    const queue = global.distube.getQueue(interaction.guildId);
    await global.distube.skip(interaction.guildId);

    const currentSong = queue.songs[0];

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    });

    const newSong = queue.songs[0];

    embed.setThumbnail(newSong?.thumbnail);
    await embed.init();

    let description = "La traccia precedente è stata saltata.";
    if (newSong) {
      description += `\n\n**▶️ Ora in Riproduzione:**\n[${newSong.name}](${newSong.url})`;
    } else {
      description += "\n\nLa coda ora è vuota.";
    }

    embed.setTitle("⏭️ Traccia Saltata").setDescription(description);

    if (newSong) {
      embed.addFields(
        {
          name: "Artista",
          value: newSong.uploader?.name ?? "Sconosciuto",
          inline: true,
        },
        {
          name: "Durata",
          value: newSong.formattedDuration ?? "N/A",
          inline: true,
        }
      );
    }

    return {
      embeds: [embed],
    };
  },
};
