import { EmbedBuilder } from "discord.js";
import DynamicColor from "../color/DynamicColor.js";
import ColorFunctions from "../color/ColorFunctions.js";
import BotConsole from "../console/BotConsole.js";

const STATUS_COLORS = {
  SUCCESS: "#57F287",
  WARNING: "#FEE75C",
  DANGER: "#ED4245",
  INFO: "#5865F2",
  DEFAULT: "#8A0303",
};

export default class PresetEmbed extends EmbedBuilder {
  static DEFAULT_COLOR = STATUS_COLORS.DEFAULT; // Usa la costante definita sopra
  static AVATAR_OPTIONS = { dynamic: true, format: "png", size: 512 };

  #guild;
  #member;
  #image;
  #colorizer = new DynamicColor();

  constructor({ guild = null, member = null, image = null } = {}) {
    super();
    this.#guild = guild;
    this.#member = member;
    this.#image = image;
  }

  async init(useDynamicColor = true) {
    this.setTimestamp();

    if (useDynamicColor) {
      try {
        await this._applyColorFromImage();
      } catch (err) {
        BotConsole.debug(
          "PresetEmbed: Fallito _applyColorFromImage, uso colore default.",
          err.message
        );
        this.setColor(PresetEmbed.DEFAULT_COLOR);
      }
    } else {
      this.setColor(PresetEmbed.DEFAULT_COLOR);
    }

    if (this.#guild) {
      try {
        const owner = await this.#guild.fetchOwner();
        this.setAuthor({
          name: owner.user.username,
          iconURL: owner.user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
        });
      } catch {
        this.setAuthor({ name: this.#guild.name });
      }
    }

    if (this.#member) {
      const u = this.#member.user;
      this.setFooter({
        text: `📢 Richiesta da ${u.username}`,
        iconURL: u.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
      });
    }
    return this;
  }

  async _applyColorFromImage() {
    const url =
      this.#image ??
      this.data.thumbnail?.url ??
      client?.user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS);

    if (!url) {
      BotConsole.debug(
        "PresetEmbed: Nessuna URL immagine per _applyColorFromImage, uso colore default."
      );
      this.setColor(PresetEmbed.DEFAULT_COLOR);
      return;
    }

    await this.#colorizer.setImgUrl(url);
    const { palette } = await this.#colorizer.getPaletteAndTextColor();
    if (!palette?.length) {
      BotConsole.debug(
        "PresetEmbed: Palette vuota da _applyColorFromImage, uso colore default."
      );
      this.setColor(PresetEmbed.DEFAULT_COLOR);
      return;
    }

    const hex = ColorFunctions.rgbToHex(...palette[0]);
    this.setColor(hex);
  }

  setThumbnailclient() {
    return this.setThumbnail(
      client?.user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS)
    );
  }

  setAuthorFromUser(userOrMember) {
    const user = userOrMember?.user ?? userOrMember;
    if (user) {
      this.setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
      });
    }
    return this;
  }

  setFooterFromText(text, iconURL) {
    return this.setFooter({ text, iconURL });
  }

  setImageUrl(url) {
    this.#image = url;
    return this.setImage(url);
  }

  setThumbnailUrl(url) {
    return this.setThumbnail(url);
  }

  setGuildThumbnail() {
    const icon = this.#guild?.iconURL?.(PresetEmbed.AVATAR_OPTIONS);
    return icon ? this.setThumbnail(icon) : this;
  }

  setLink(url) {
    return this.setURL(url);
  }

  setMainContent(title, description) {
    if (title) this.setTitle(title);
    if (description) this.setDescription(description);
    return this;
  }

  addFieldInline(name, value) {
    return this.addFields({ name, value, inline: true });
  }

  addFieldBlock(name, value) {
    return this.addFields({ name, value, inline: false });
  }

  addInlineFields(fields = []) {
    fields.forEach((f) => this.addFieldInline(f.name, f.value));
    return this;
  }

  addBlockFields(fields = []) {
    fields.forEach((f) => this.addFieldBlock(f.name, f.value));
    return this;
  }

  clearAllFields() {
    return this.setFields([]);
  }

  setRandomColor() {
    const rand = () => 180 + Math.floor(Math.random() * 75);
    return this.setColor(ColorFunctions.rgbToHex(rand(), rand(), rand()));
  }

  brightenColor(amount = 20) {
    const hexCurrent =
      typeof this.data.color === "number"
        ? `#${this.data.color.toString(16).padStart(6, "0")}`
        : this.data.color ?? PresetEmbed.DEFAULT_COLOR;

    const [r, g, b] = ColorFunctions.hexToRgb(hexCurrent);
    const [nr, ng, nb] = [r, g, b].map((v) => Math.min(255, v + amount));

    return this.setColor(ColorFunctions.rgbToHex(nr, ng, nb));
  }

  KSuccess(title, description) {
    this.setColor(STATUS_COLORS.SUCCESS);
    if (title) this.setTitle(title);
    if (description) this.setDescription(description);
    return this;
  }

  KWarning(title, description) {
    this.setColor(STATUS_COLORS.WARNING);
    if (title) this.setTitle(title);
    if (description) this.setDescription(description);
    return this;
  }

  KDanger(title, description) {
    this.setColor(STATUS_COLORS.DANGER);
    if (title) this.setTitle(title);
    if (description) this.setDescription(description);
    return this;
  }

  KInfo(title, description) {
    this.setColor(STATUS_COLORS.INFO);
    if (title) this.setTitle(title);
    if (description) this.setDescription(description);
    return this;
  }
}
