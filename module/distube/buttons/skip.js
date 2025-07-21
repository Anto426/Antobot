import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "skip",
  permissions: [],
  isActive: true,
  disTube: {
    requireUserInVoiceChannel: true,
    requireSameVoiceChannel: true,
    requireBotInVoiceChannel: true,
    requireTrackInQueue: true,
    disallowIfPaused: true,
    disallowIfPlaying: false,
    requireAdditionalTracks: true,
    requireSeekable: false,
  },

  async execute(interaction) {
    const { guild, member } = interaction;
    const queue = global.distube.getQueue(guild);

    try {
      const skippedSong = queue.songs[0];
      const nextSong = queue.songs[1];

      await queue.skip();

      const embed = await new PresetEmbed({
        guild,
        member,
        image: nextSong?.thumbnail,
      }).init();
      embed
        .setTitle("⏭️ Traccia Saltata")
        .setDescription(
          `Saltata **[${skippedSong.name}](${skippedSong.url})**.`
        );

      return { embeds: [embed], ephemeral: true };
    } catch (e) {
      await queue.stop();
      await interaction.update({ components: [] });

      const embed = await new PresetEmbed({ guild, member }).init();
      embed
        .setTitle("✅ Coda Terminata")
        .setDescription("Non ci sono altre canzoni da riprodurre.");
      return { embeds: [embed], ephemeral: true };
    }
  },
};
