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
    this.#isReady = true; // Preveniamo tentativi multipli


    try {
      this.#config = SystemCheck.getConfigProperty("paths", "assets", "canvas");

      if (!this.#config || !this.#config.fonts) {
        BotConsole.warning(
          "[WelcomeImg] Config 'paths.assets.canvas' (fonts) non trovata in SystemCheck. Funzionalità disabilitata."
        );
        this.#isReady = false; // Il servizio non è pronto se manca la config
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
          BotConsole.info(`[WelcomeImg] Font registrato: ${fontFamily}`);
        });
      } else {
        BotConsole.info("[WelcomeImg] Nessun font personalizzato configurato.");
      }

      BotConsole.success(
        "[WelcomeImg] Sistema immagini inizializzato con successo."
      );
    } catch (error) {
      BotConsole.error(
        "[WelcomeImg] Fallita inizializzazione del servizio.",
        error
      );
      this.#isReady = false; // Segna come non pronto in caso di errore
    }
  }

  async generate(member, guildMemberCount) {
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
      await dynamicColor.setImgUrl(
        member.user.displayAvatarURL({ extension: "png", size: 256 })
      );
      const colorData = await dynamicColor.getPaletteAndTextColor();
      const palette = colorData?.palette || [
        [45, 52, 54],
        [99, 110, 114],
        [223, 230, 233],
      ];
      const textColor = colorData?.textColor || [255, 255, 255];
      const textColorRgb = `rgb(${textColor.join(",")})`;

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

      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.beginPath();
      ctx.roundRect(70, 70, canvas.width - 140, canvas.height - 140, 60);
      ctx.fill();

      const avatarSize = welcomeSettings.avatarSize;
      const avatarX = 70 + 80;
      const avatarY = canvas.height / 2 - avatarSize / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      const avatarImg = await loadImage(
        member.user.displayAvatarURL({ extension: "png", size: 512 })
      );
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      ctx.strokeStyle = textColorRgb;
      ctx.lineWidth = welcomeSettings.avatarBorderSize;
      ctx.beginPath();
      ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      ctx.fillStyle = textColorRgb;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const textStartX = avatarX + avatarSize + 70;

      const useCustomFonts =
        fontSettings?.files && fontSettings.files.length > 0;
      const fontFamily1 = useCustomFonts
        ? fontSettings.files[0].split(".")[0]
        : "Sans-Serif";
      const fontFamily2 = useCustomFonts
        ? fontSettings.files[1]?.split(".")[0] || fontFamily1
        : "Impact";

      ctx.font = `${welcomeSettings.welcomeTextSize} "${fontFamily1}"`;
      ctx.fillText("Benvenuto", textStartX, canvas.height * 0.3);

      const memberName = (member.user.globalName || member.displayName).slice(
        0,
        25
      );
      ctx.font = `${welcomeSettings.nameTextSize} "${fontFamily2}"`;
      ctx.fillText(memberName, textStartX, canvas.height / 2);

      ctx.font = `${welcomeSettings.countTextSize} "${fontFamily1}"`;
      ctx.fillText(
        `${guildMemberCount}° membro del server!`,
        textStartX,
        canvas.height * 0.7
      );

      const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
        name: `welcome-${member.id}.png`,
      });
      const embedColorHex = `#${textColor
        .map((c) => c.toString(16).padStart(2, "0"))
        .join("")}`;

      return { attachment, embedColorHex };
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
