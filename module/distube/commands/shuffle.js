import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "shuffle",
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
    requireAdditionalTracks: true,
  },
  data: {
    name: "shuffle",
    description: "Mischia la coda attuale",
  },

  async execute(interaction) {
    const queue = global.distube.getQueue(interaction);
    queue.shuffle();

    const embed = await new PresetEmbed({
      guild: interaction.guild,
      member: interaction.member,
    }).init();

    const nextSongs = queue.songs.slice(1, 6);
    const tracksShuffled = queue.songs.length > 1 ? queue.songs.length - 1 : 0;

    let newOrderText =
      "Le tracce in coda sono state riorganizzate casualmente.";
    if (nextSongs.length > 0) {
      newOrderText += "\n\n**Ecco le prossime 5 tracce:**\n";
      newOrderText += nextSongs
        .map((song, i) => `**${i + 2}.** [${song.name}](${song.url})`)
        .join("\n");
    }

    embed
      .setTitle("🔀 Coda Mischiata")
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(newOrderText)
      .addFields(
        {
          name: "Tracce Riorganizzate",
          value: `**${tracksShuffled}**`,
          inline: true,
        },
        { name: "Brano Attuale", value: "Non modificato", inline: true }
      );

    return { embeds: [embed], ephemeral: true };
  },
};
