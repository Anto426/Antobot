import { EmbedBuilder } from "discord.js";
import DynamicColor from "../color/DynamicColor.js";
import ColorFunctions from "../color/ColorFunctions.js";

export default class PresetEmbed extends EmbedBuilder {
  static DEFAULT_COLOR = "#0099ff";
  static AVATAR_OPTIONS = { dynamic: true, format: "png", size: 512 };

  #guild;
  #member;
  #image;
  #colorizer;

  constructor({ guild = null, member = null, image = null } = {}) {
    super();
    this.#guild = guild;
    this.#member = member;
    this.#image = image;
    this.#colorizer = new DynamicColor();

    this.setTimestamp();

    this.setColorFromImage().catch(() =>
      this.setColor(PresetEmbed.DEFAULT_COLOR)
    );
    this.setAuthorFromGuild().catch(() => {});
    this.setFooterFromMember();
  }

  async init() {
    await this.setAuthorFromGuild().catch(() => {});
    this.setFooterFromMember();
    return this;
  }

  async setAuthorFromGuild() {
    if (!this.#guild) return this;
    try {
      const owner = await this.#guild.fetchOwner();
      const user = owner.user;
      this.setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
      });
    } catch (err) {
      console.warn("Impossibile recuperare owner guild:", err);
      this.setAuthor({ name: this.#guild.name });
    }
    return this;
  }

  setAuthorFromUser(userOrMember) {
    if (!userOrMember) return this;
    const user = userOrMember.user ?? userOrMember; // GuildMember or User
    this.setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
    });
    return this;
  }

  setFooterFromMember() {
    if (!this.#member) return this;
    const user = this.#member.user;
    this.setFooter({
      text: `📢 Richiesta di ${user.username}`,
      iconURL: user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
    });
    return this;
  }

  setFooterFromText(text, iconURL) {
    this.setFooter({ text, iconURL });
    return this;
  }

  async setColorFromImage() {
    let url = this.#image || this.data.thumbnail?.url;

    if (!url) {
      const client = this.#guild?.client;
      if (client?.user) {
        url = client.user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS);
      } else {
        this.setColor(PresetEmbed.DEFAULT_COLOR);
        return this;
      }
    }

    try {
      await this.#colorizer.setImgUrl(url);
      const { palette } = await this.#colorizer.getPaletteAndTextColor();
      if (!palette || palette.length === 0) throw new Error("Palette vuota");
      const [r, g, b] = palette[0];
      const hex = ColorFunctions.rgbToHex(r, g, b);
      this.setColor(hex);
    } catch (err) {
      console.error("Errore nel calcolo colore da immagine:", err);
      this.setColor(PresetEmbed.DEFAULT_COLOR);
    }

    return this;
  }

  setMainContent(title, description) {
    return this.setTitle(title).setDescription(description);
  }

  addFieldInline(name, value) {
    return this.addFields({ name, value, inline: true });
  }

  addFieldBlock(name, value) {
    return this.addFields({ name, value, inline: false });
  }

  addInlineFields(fields = []) {
    fields.forEach(({ name, value }) => this.addFieldInline(name, value));
    return this;
  }

  addBlockFields(fields = []) {
    fields.forEach(({ name, value }) => this.addFieldBlock(name, value));
    return this;
  }

  setImageUrl(url) {
    this.#image = url;
    return this.setImage(url);
  }

  setThumbnailUrl(url) {
    return this.setThumbnail(url);
  }

  clearAllFields() {
    return this.setFields([]);
  }

  setLink(url) {
    return this.setURL(url);
  }

  setGuildThumbnail() {
    if (!this.#guild) return this;
    const iconURL = this.#guild.iconURL?.(PresetEmbed.AVATAR_OPTIONS);
    if (iconURL) this.setThumbnail(iconURL);
    return this;
  }

  setRandomColor() {
    const r = 180 + Math.floor(Math.random() * 75);
    const g = 180 + Math.floor(Math.random() * 75);
    const b = 180 + Math.floor(Math.random() * 75);
    this.setColor(ColorFunctions.rgbToHex(r, g, b));
    return this;
  }

  brightenColor(amount = 20) {
    let hexColor;

    if (typeof this.data.color === "number") {
      hexColor = `#${this.data.color.toString(16).padStart(6, "0")}`;
    } else if (typeof this.data.color === "string") {
      hexColor = this.data.color;
    } else {
      hexColor = PresetEmbed.DEFAULT_COLOR;
    }

    const [r, g, b] = ColorFunctions.hexToRgb(hexColor);
    const [nr, ng, nb] = [r, g, b].map((v) => Math.min(255, v + amount));
    this.setColor(ColorFunctions.rgbToHex(nr, ng, nb));
    return this;
  }
}
