import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import BotConsole from "../../../class/console/BotConsole.js";

export default {
  name: "DistubeError",
  eventType: "error",
  isActive: true,

  async execute(channel, error) {
    BotConsole.error(`[DisTube Error] Errore in ${channel.guild.name}:`, error);

    const embed = await new PresetEmbed({
      guild: channel.guild,
      image: channel.client.user.displayAvatarURL(),
    }).init();

    embed
      .setTitle("❌ Errore Musicale")
      .setDescription(
        "Si è verificato un errore imprevisto nel sistema musicale."
      );

    if (error.message) {
      const cleanMessage = error.message.split("\n")[0];
      embed.addFields({
        name: "Dettagli",
        value: `\`\`\`${cleanMessage.slice(0, 1000)}\`\`\``,
      });
    }

    await queue.lastPlayingMessage.edit({ embeds: [embed] });
  },
};
