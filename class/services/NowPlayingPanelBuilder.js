import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import PresetEmbed from "../embed/PresetEmbed.js";

const ICONS = {
  PLAYING: "https://i.imgur.com/8c7B1OC.gif",
  PAUSED: "https://i.imgur.com/ag3OT03.png",
};

const formatTime = (timeStr) => {
  const parts = timeStr.split(":");
  if (parts.length === 2)
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  if (parts.length === 3)
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(
      2,
      "0"
    )}:${parts[2].padStart(2, "0")}`;
  return timeStr.padStart(5, " ");
};

export default class NowPlayingPanelBuilder {
  #queue;
  #song;
  #isPaused;

  constructor(queue) {
    if (!queue || !queue.songs[0]) {
      throw new Error(
        "Impossibile costruire il pannello senza una coda valida."
      );
    }
    this.#queue = queue;
    this.#song = queue.songs[0];
    this.#isPaused = queue.paused;
  }

  async build() {
    const embed = await this.#createEmbed();
    const components = this.#createComponents();
    return { embeds: [embed], components };
  }

  #createProgressBar() {
    if (this.#song.isLive) return "`--:--` ┃ 🔴 LIVE";

    const total = this.#song.duration;
    const current = this.#queue.currentTime;
    const barLength = 24;
    const filledLength = Math.round((current / total) * barLength);
    const playhead = this.#isPaused ? "⏸" : "🔵";
    const bar =
      "─".repeat(filledLength) +
      playhead +
      "─".repeat(barLength - filledLength);

    return `\`${formatTime(
      this.#queue.formattedCurrentTime
    )}\` ${bar} \`${formatTime(this.#song.formattedDuration)}\``;
  }

  async #createEmbed() {
    const embed = await new PresetEmbed({
      guild: this.#queue.textChannel.guild,
      member: this.#song.member,
      image: this.#song.thumbnail,
    }).init();

    const authorText = this.#isPaused ? "In Pausa" : "In Riproduzione";
    const authorIcon = this.#isPaused ? ICONS.PAUSED : ICONS.PLAYING;
    const loopModeText = ["Off", "Traccia", "Coda"][this.#queue.repeatMode];
    const autoplayText = this.#queue.autoplay ? "✅ Attivo" : "❌ Spento";
    const songTitle =
      this.#song.name.length > 55
        ? this.#song.name.substring(0, 52) + "..."
        : this.#song.name;

    embed
      .setAuthor({ name: authorText, iconURL: authorIcon })
      .setTitle(songTitle)
      .setURL(this.#song.url)
      .setThumbnail(this.#song.thumbnail)
      .addFields(
        { name: " ", value: this.#createProgressBar() },
        {
          name: " ",
          value: `*Caricata da **${
            this.#song.uploader?.name ?? "Sconosciuto"
          }** • Richiesta da ${this.#song.user}*`,
        },
        { name: "Volume", value: `\`${this.#queue.volume}%\``, inline: true },
        { name: "Loop", value: `\`${loopModeText}\``, inline: true },
        { name: "Autoplay", value: `\`${autoplayText}\``, inline: true }
      );
    return embed;
  }

  #createComponents() {
    const isLooping = this.#queue.repeatMode > 0;
    const isAutoplayOn = this.#queue.autoplay;

    const mainControls = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("toggleplay")
        .setLabel(this.#isPaused ? "Riprendi" : "Pausa")
        .setStyle(this.#isPaused ? ButtonStyle.Success : ButtonStyle.Primary)
        .setEmoji(this.#isPaused ? "▶️" : "⏸️"),
      new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Salta")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⏭️"),
      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("Stop")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("⏹️")
    );
    const secondaryControls = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("repeat")
        .setLabel("Loop")
        .setStyle(isLooping ? ButtonStyle.Success : ButtonStyle.Secondary)
        .setEmoji("🔁"),
      new ButtonBuilder()
        .setCustomId("autoplay")
        .setLabel("Autoplay")
        .setStyle(isAutoplayOn ? ButtonStyle.Success : ButtonStyle.Secondary)
        .setEmoji("♾️"),
      new ButtonBuilder()
        .setCustomId("volume")
        .setLabel("Volume")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🔊"),
      new ButtonBuilder()
        .setCustomId("list")
        .setLabel("Coda")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("📜")
    );

    return [mainControls, secondaryControls];
  }
}
