import { EmbedBuilder } from "discord.js";
import DynamicColor from "./../color/DynamicColor.js";

class PresetEmbed extends EmbedBuilder {
  static DEFAULT_COLOR = '#0099ff';
  static AVATAR_OPTIONS = {
    dynamic: true,
    format: "png",
    size: 512,
  };

  constructor(guild = null, member = null, image = null) {
    super();
    this.guild = guild;
    this.member = member;
    this.image = image;
    this.color = new DynamicColor();
    this.setTimestamp();
  }

  async setAuthorFromGuild() {
    if (!this.guild) return this;
    const owner = await this.guild.fetchOwner();
    this.setAuthor({
      name: owner.user.username,
      iconURL: owner.user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
    });
    return this;
  }

  setFooterFromMember() {
    if (!this.member) return this;
    this.setFooter({
      text: `📢 Richiesta effetuata da ${this.member.user.username}`,
      iconURL: this.member.user.displayAvatarURL(PresetEmbed.AVATAR_OPTIONS),
    });
    return this;
  }

  async setColorFromImage() {
    if (!this.image) {
      this.setColor(PresetEmbed.DEFAULT_COLOR);
      return this;
    }

    try {
      await this.color.setImgUrl(this.image);
      this.color.setThreshold(50).setNumcolorextract(2);
      const [mainColor] = await this.color.ExtractPalet();
      const [r, g, b] = mainColor;
      this.setColor(this.color.ColorFunctions.rgbToHex(r, g, b));
    } catch (error) {
      console.error('Error setting color from image:', error);
      this.setColor(PresetEmbed.DEFAULT_COLOR);
    }
    return this;
  }

  async init() {
    try {
      await this.setAuthorFromGuild();
      this.setFooterFromMember();
      await this.setColorFromImage();
      return this;
    } catch (error) {
      console.error('Error initializing embed:', error);
      throw error;
    }
  }

  setMainContent(title, description) {
    return this.setTitle(title).setDescription(description);
  }
}

export default PresetEmbed;
