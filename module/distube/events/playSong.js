import PresetEmbed from "../../../class/embed/PresetEmbed.js";
import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

const createProgressBar = (queue) => {
  if (!queue || !queue.songs[0] || queue.songs[0].duration === 0) return "⠀";

  const song = queue.songs[0];
  const total = song.duration;
  const current = queue.currentTime;
  const barLength = 18;
  const filledLength = Math.round((current / total) * barLength);

  const bar =
    "─".repeat(filledLength) + "🔵" + "─".repeat(barLength - filledLength);
  return `\`${queue.formattedCurrentTime}\` ${bar} \`${song.formattedDuration}\``;
};

export default {
  name: "PlaySong",
  eventType: "playSong",
  isActive: true,

  async execute(queue, song) {
    if (queue.lastPlayingMessage) {
      try {
        (await queue.lastPlaying) - message.delete();
      } catch (e) {}
    }

    const embed = await new PresetEmbed({
      guild: queue.textChannel.guild,
      member: song.member,
      image: song.thumbnail,
    }).init();

    const loopModeText =
      queue.repeatMode === 2
        ? "Coda"
        : queue.repeatMode === 1
        ? "Traccia"
        : "Off";

    embed
      .setAuthor({
        name: "In Riproduzione",
        iconURL: "https://i.imgur.com/8c7B1OC.gif",
      })
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .addFields(
        { name: "\u200B", value: createProgressBar(queue) },
        { name: "Richiesta da", value: song.user.toString(), inline: true },
        { name: "Volume", value: `\`${queue.volume}%\``, inline: true },
        { name: "Loop", value: `\`${loopModeText}\``, inline: true }
      );

    const mainControls = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("toggleplay")
        .setLabel("Pausa/Riprendi")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⏯️"),
      new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Salta")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⏭️"),
      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("Stop")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⏹️")
    );

    const secondaryControls = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("repeat")
        .setLabel("Loop")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🔁"),
      new ButtonBuilder()
        .setCustomId("queue")
        .setLabel("Coda")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("📜")
    );

    try {
      const message = await queue.textChannel.send({
        embeds: [embed],
        components: [mainControls, secondaryControls],
      });
      queue.lastPlayingMessage = message;
    } catch (e) {
      console.error("PlaySong Event Error:", e);
    }
  },
};
