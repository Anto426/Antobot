import { AttachmentBuilder } from "discord.js";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import BotConsole from "../../class/console/BotConsole.js";
import DynamicColor from "../../class/color/DynamicColor.js";
import SystemCheck from "../../class/client/SystemCheck.js";

class WelcomeImageService {
  #config = null;
  #isReady = false;

  constructor() {}

  async init() {
    if (this.#isReady) return;

    try {
      this.#config = SystemCheck.getConfigProperty("paths", "assets", "canvas");
      if (!this.#config || !this.#config.welcome_image || !this.#config.fonts) {
        BotConsole.warning(
          "[WelcomeImg] Config 'paths.assets.canvas' non trovata. Funzionalità disabilitata."
        );
        this.#isReady = false;
        return;
      }

      const customFonts = this.#config.fonts.files;
      if (customFonts && customFonts.length > 0) {
        const baseDir = process.env.DIRBOT || process.cwd();
        const fontDir = this.#config.fonts.directory;
        customFonts.forEach((fontFile) => {
          const fontPath = path.join(baseDir, fontDir, fontFile);
          const fontFamily = fontFile.split(".")[0];
          registerFont(fontPath, { family: fontFamily });
        });
      }
      this.#isReady = true; // Impostato solo alla fine di un'inizializzazione riuscita
      BotConsole.success(
        "[WelcomeImg] Sistema immagini inizializzato con successo."
      );
    } catch (error) {
      BotConsole.error(
        "[WelcomeImg] Fallita inizializzazione del servizio.",
        error
      );
      this.#isReady = false;
    }
  }

  /**
   * Genera l'immagine di benvenuto con una grafica migliorata.
   * @param {import("discord.js").GuildMember} member
   * @param {import("discord.js").Guild} guild
   */
  async generate(member, guild) {
    if (!this.#isReady) {
      BotConsole.warning(
        "[WelcomeImg] Servizio non pronto, impossibile generare immagine."
      );
      return null;
    }

    const welcomeSettings = this.#config.welcome_image;
    const fontSettings = this.#config.fonts;
    const canvas = createCanvas(welcomeSettings.width, welcomeSettings.height);
    const ctx = canvas.getContext("2d");

    try {
      const dynamicColor = new DynamicColor();
      const avatarUrl = member.user.displayAvatarURL({
        extension: "png",
        size: 512,
      });
      await dynamicColor.setImgUrl(avatarUrl);
      const colorData = await dynamicColor.getPaletteAndTextColor();

      const palette = colorData?.palette || [
        [28, 28, 32],
        [42, 42, 48],
        [56, 56, 64],
      ];
      const textColor = colorData?.textColor || [240, 240, 240];
      const textColorRgb = `rgb(${textColor.join(",")})`;

      const layout = {
        padding: 70,
        cardRadius: 90, // Increased card radius for more rounded corners
        avatarSize: welcomeSettings.avatarSize,
        get avatarX() {
          return this.padding + 80;
        },
        get avatarY() {
          return (canvas.height - this.avatarSize) / 2;
        },
        get textStartX() {
          return this.avatarX + this.avatarSize + 70;
        },
      };

      // --- BACKGROUND WITH GRADIENT ---
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      palette
        .slice(0, welcomeSettings.num_colors || 3)
        .forEach((color, i, arr) => {
          gradient.addColorStop(
            i / (arr.length - 1 || 1),
            `rgb(${color.join(",")})`
          );
        });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- CARD WITH BLUR AND SHADOW ---
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.roundRect(
        layout.padding,
        layout.padding,
        canvas.width - layout.padding * 2,
        canvas.height - layout.padding * 2,
        layout.cardRadius
      );
      ctx.fill();
      ctx.restore();

      // --- AVATAR WITH BORDER AND GLOW ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        layout.avatarX + layout.avatarSize / 2,
        layout.avatarY + layout.avatarSize / 2,
        layout.avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      const avatarImg = await loadImage(avatarUrl);
      ctx.drawImage(
        avatarImg,
        layout.avatarX,
        layout.avatarY,
        layout.avatarSize,
        layout.avatarSize
      );
      ctx.restore();

      ctx.save();
      ctx.shadowColor = textColorRgb;
      ctx.shadowBlur = 15;
      ctx.strokeStyle = textColorRgb;
      ctx.lineWidth = welcomeSettings.avatarBorderSize;
      ctx.beginPath();
      ctx.arc(
        layout.avatarX + layout.avatarSize / 2,
        layout.avatarY + layout.avatarSize / 2,
        layout.avatarSize / 2 + ctx.lineWidth / 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();

      // --- TEXT WITH MODERN TYPOGRAPHY ---
      ctx.fillStyle = textColorRgb;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const useCustomFonts =
        fontSettings?.files && fontSettings.files.length > 0;
      const fontFamily1 = useCustomFonts
        ? fontSettings.files[0].split(".")[0]
        : "Sans-Serif";
      const fontFamily2 = useCustomFonts
        ? fontSettings.files[1]?.split(".")[0] || fontFamily1
        : "Impact";

      ctx.font = `bold ${welcomeSettings.welcomeTextSize} "${fontFamily1}"`;
      ctx.fillText("Benvenuto", layout.textStartX, canvas.height * 0.3);

      const memberName = (member.user.globalName || member.displayName).slice(
        0,
        25
      );
      ctx.font = `bold ${welcomeSettings.nameTextSize} "${fontFamily2}"`;
      ctx.fillText(memberName, layout.textStartX, canvas.height / 2);

      ctx.font = `${welcomeSettings.countTextSize} "${fontFamily1}"`;
      ctx.fillText(
        `${guild.memberCount}° membro del server!`,
        layout.textStartX,
        canvas.height * 0.7
      );

      ctx.save();
      ctx.globalAlpha = 0.3; // Slightly more visible watermark
      const iconSize = 140; // Increased icon size for better visibility
      const guildIconImg = await loadImage(
        guild.iconURL({ extension: "png", size: 128 })
      );
      ctx.beginPath();
      ctx.arc(
        canvas.width - iconSize / 2 - 50,
        canvas.height - iconSize / 2 - 50,
        iconSize / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(
        guildIconImg,
        canvas.width - iconSize - 50,
        canvas.height - iconSize - 50,
        iconSize,
        iconSize
      );
      ctx.restore();

      // --- OUTPUT ---
      const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
        name: `welcome-${member.id}.png`,
      });

      return { attachment, embedColorHex: colorData.textColor };
    } catch (error) {
      BotConsole.error(
        "[WelcomeImg] Errore fatale durante la generazione dell'immagine.",
        error
      );
      return null;
    }
  }
}

export default new WelcomeImageService();
