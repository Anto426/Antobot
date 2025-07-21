import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "Disconnect",
  eventType: "disconnect",
  isActive: true,

  async execute(queue) {
    const voiceChannelName = queue.voiceChannel?.name ?? "canale vocale";

    const embed = await new PresetEmbed({
      guild: queue.textChannel.guild,
      image: queue.client.user.displayAvatarURL(),
    }).init();

    embed
      .setTitle("👋 Sessione Musicale Terminata")
      .setThumbnail(queue.client.user.displayAvatarURL())
      .setDescription(`Ho lasciato il canale **${voiceChannelName}**.`)
      .addFields(
        {
          name: "Durata Totale",
          value: `\`${queue.formattedUptime}\``,
          inline: true,
        },
        {
          name: "Tracce Rimaste",
          value: `\`${queue.songs.length}\``,
          inline: true,
        }
      );

    await queue.textChannel.send({ embeds: [embed] });
  },
};
