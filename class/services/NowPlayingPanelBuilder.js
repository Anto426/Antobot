import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import PresetEmbed from "../embed/PresetEmbed.js";

// --- Costanti per una facile configurazione ---

const ICONS = {
  PLAYING: "https://i.imgur.com/8c7B1OC.gif",
  PAUSED: "https://i.imgur.com/ag3OT03.png",
};

const EMOJIS = {
  PLAY: "▶️",
  PAUSE: "⏸️",
  SKIP: "⏭️",
  STOP: "⏹️",
  LOOP: "🔁",
  AUTOPLAY: "♾️",
  VOLUME: "🔊",
  QUEUE: "📜",
  LIVE: "🔴",
  PLAYHEAD: "🔵",
};

const PROGRESS_BAR = {
  LENGTH: 24,
  FILLED_CHAR: "─",
  EMPTY_CHAR: "─",
};

const STRINGS = {
  PAUSED: "In Pausa",
  PLAYING: "In Riproduzione",
  UNKNOWN_UPLOADER: "Sconosciuto",
  LIVE_NOW: "🔴 LIVE",
  LOOP_MODES: ["Off", "Traccia", "Coda"],
  AUTOPLAY_STATUS: (enabled) => (enabled ? "✅ Attivo" : "❌ Spento"),
};

// --- Funzioni di utilità ---

const formatTime = (timeStr) => {
  const parts = timeStr.split(":");
  return parts
    .map((part) => part.padStart(2, "0"))
    .join(":")
    .padStart(5, " ");
};

const truncate = (str, maxLength) =>
  str.length > maxLength ? `${str.substring(0, maxLength - 3)}...` : str;

// --- Classe principale ---

export default class NowPlayingPanelBuilder {
  #queue;
  #song;
  #isPaused;

  constructor(queue) {
    if (!queue?.songs?.[0]) {
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
    if (this.#song.isLive) {
      return `\`--:--\` ┃ ${STRINGS.LIVE_NOW}`;
    }

    const { LENGTH, FILLED_CHAR, EMPTY_CHAR } = PROGRESS_BAR;
    const current = this.#queue.currentTime;
    const total = this.#song.duration;
    const filledLength = Math.round((current / total) * LENGTH);
    const playhead = this.#isPaused ? EMOJIS.PAUSE : EMOJIS.PLAYHEAD;

    const bar =
      FILLED_CHAR.repeat(filledLength) +
      playhead +
      EMPTY_CHAR.repeat(LENGTH - filledLength);

    const currentTimeFormatted = formatTime(this.#queue.formattedCurrentTime);
    const totalTimeFormatted = formatTime(this.#song.formattedDuration);

    return `\`${currentTimeFormatted}\` ${bar} \`${totalTimeFormatted}\``;
  }

  async #createEmbed() {
    const embed = await new PresetEmbed({
      guild: this.#queue.textChannel.guild,
      member: this.#song.member,
      image: this.#song.thumbnail,
    }).init();

    const authorText = this.#isPaused ? STRINGS.PAUSED : STRINGS.PLAYING;
    const authorIcon = this.#isPaused ? ICONS.PAUSED : ICONS.PLAYING;

    embed
      .setAuthor({ name: authorText, iconURL: authorIcon })
      .setTitle(truncate(this.#song.name, 55))
      .setURL(this.#song.url)
      .setThumbnail(this.#song.thumbnail)
      .addFields(
        { name: " ", value: this.#createProgressBar() },
        {
          name: " ",
          value: `*Caricata da **${
            this.#song.uploader?.name ?? STRINGS.UNKNOWN_UPLOADER
          }** • Richiesta da ${this.#song.user}*`,
        },
        {
          name: "Volume",
          value: `\`${this.#queue.volume}%\``,
          inline: true,
        },
        {
          name: "Loop",
          value: `\`${STRINGS.LOOP_MODES[this.#queue.repeatMode]}\``,
          inline: true,
        },
        {
          name: "Autoplay",
          value: `\`${STRINGS.AUTOPLAY_STATUS(this.#queue.autoplay)}\``,
          inline: true,
        }
      );
    return embed;
  }

  #createComponents() {
    const buttonConfigs = [
      // Prima riga: Controlli principali
      [
        {
          id: "toggleplay",
          label: this.#isPaused ? "Riprendi" : "Pausa",
          style: this.#isPaused ? ButtonStyle.Success : ButtonStyle.Primary,
          emoji: this.#isPaused ? EMOJIS.PLAY : EMOJIS.PAUSE,
        },
        {
          id: "skip",
          label: "Salta",
          style: ButtonStyle.Secondary,
          emoji: EMOJIS.SKIP,
        },
        {
          id: "stop",
          label: "Stop",
          style: ButtonStyle.Danger,
          emoji: EMOJIS.STOP,
        },
      ],
      // Seconda riga: Controlli secondari
      [
        {
          id: "repeat",
          label: "Loop",
          style:
            this.#queue.repeatMode > 0
              ? ButtonStyle.Success
              : ButtonStyle.Secondary,
          emoji: EMOJIS.LOOP,
        },
        {
          id: "autoplay",
          label: "Autoplay",
          style: this.#queue.autoplay
            ? ButtonStyle.Success
            : ButtonStyle.Secondary,
          emoji: EMOJIS.AUTOPLAY,
        },
        {
          id: "volume",
          label: "Volume",
          style: ButtonStyle.Secondary,
          emoji: EMOJIS.VOLUME,
        },
        {
          id: "queue",
          label: "Coda",
          style: ButtonStyle.Secondary,
          emoji: EMOJIS.QUEUE,
        },
      ],
    ];

    return buttonConfigs.map((rowConfig) =>
      new ActionRowBuilder().addComponents(
        rowConfig.map((btn) =>
          new ButtonBuilder()
            .setCustomId(btn.id)
            .setLabel(btn.label)
            .setStyle(btn.style)
            .setEmoji(btn.emoji)
        )
      )
    );
  }
}
