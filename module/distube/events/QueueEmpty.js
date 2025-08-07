import PresetEmbed from "../../../class/embed/PresetEmbed.js";

export default {
  name: "QueueEmpty",
  eventType: "empty",
  isActive: true,

  async execute(queue) {
    const voiceChannelName = queue.voiceChannel?.name ?? "il canale vocale";

    const embed = await new PresetEmbed({
      guild: queue.textChannel.guild,
      image: queue.client.user.displayAvatarURL(),
    }).init();

    embed
      .setTitle("💨 Canale Vocale Vuoto")
      .setThumbnail(queue.client.user.displayAvatarURL())
      .setDescription(
        `Tutti gli utenti hanno lasciato **${voiceChannelName}**, quindi la sessione musicale è terminata.`
      )
      .addFields(
        {
          name: "Durata Sessione",
          value: `\`${queue.formattedUptime}\``,
          inline: true,
        },
        {
          name: "Stato",
          value: "Disconnesso",
          inline: true,
        }
      );

    await queue.lastPlayingMessage.edit({ embeds: [embed] });
  },
};
