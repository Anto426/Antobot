import { EmbedBuilder } from "discord.js";
import DynamicColor from "../color/DynamicColor.js";
import ColorFunctions from "../color/ColorFunctions.js"; // Assicurati che esista

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
    this.setColor(PresetEmbed.DEFAULT_COLOR);
  }

  async setAuthorFromGuild() {
    if (!this.#guild) return this;
    try {
      const { user } = await this.#guild.fetchOwner();
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

  setFooterFromMember() {
    if (!this.#member) return this;
    const { user } = this.#member;
    this.setFooter({
      text: `📢 Richiesta di ${user.username}`,
      iconURL: user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
    });
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
      const { palette, textColor } =
        await this.#colorizer.getPaletteAndTextColor();
      const [r, g, b] = palette[0] || [0, 153, 255];
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

  async init() {
    await this.setAuthorFromGuild();
    this.setFooterFromMember();
    await this.setColorFromImage();
    return this;
  }
}
