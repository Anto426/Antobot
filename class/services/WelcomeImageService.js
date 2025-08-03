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

      // --- BACKGROUND WITH GRADIENT AND DECORATIVE SPLASHES ---
      // First, fill with the base gradient
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

      // Add decorative background splashes
      const splashCount = welcomeSettings.splashCount || 10;

      // Use screen blend mode for a glowing effect
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < splashCount; i++) {
        // Distribute splashes around the edges, avoiding the center
        let x, y;
        const centerAvoidance = 0.25; // Percentage of canvas to avoid in center

        if (Math.random() > 0.5) {
          // Place on the sides
          x =
            Math.random() > 0.5
              ? Math.random() * canvas.width * centerAvoidance
              : canvas.width - Math.random() * canvas.width * centerAvoidance;
          y = Math.random() * canvas.height;
        } else {
          // Place on the top or bottom
          x = Math.random() * canvas.width;
          y =
            Math.random() > 0.5
              ? Math.random() * canvas.height * centerAvoidance
              : canvas.height - Math.random() * canvas.height * centerAvoidance;
        }

        const baseRadius =
          Math.min(canvas.width, canvas.height) / (20 + Math.random() * 15);

        const brightColor = textColor;

        // Create a soft blob shape
        const vertices = 6 + Math.floor(Math.random() * 6); // 6-12 vertices
        const multipliers = Array.from(
          { length: vertices },
          () => 0.85 + Math.random() * 0.3
        );

        // Very subtle opacity
        const opacity = 0.1 + Math.random() * 0.1;
        const splash = ctx.createRadialGradient(x, y, 0, x, y, baseRadius);
        splash.addColorStop(0, `rgba(${brightColor.join(",")}, ${opacity})`);
        splash.addColorStop(
          0.7,
          `rgba(${brightColor.join(",")}, ${opacity * 0.7})`
        );
        splash.addColorStop(1, `rgba(${brightColor.join(",")}, 0)`);

        // Draw with smooth curves
        ctx.beginPath();

        const angleStep = (Math.PI * 2) / vertices;
        const points = [];

        for (let j = 0; j < vertices; j++) {
          const angle = j * angleStep;
          const r = baseRadius * multipliers[j];
          points.push({
            x: x + r * Math.cos(angle),
            y: y + r * Math.sin(angle),
          });
        }

        ctx.moveTo(
          (points[0].x + points[vertices - 1].x) / 2,
          (points[0].y + points[vertices - 1].y) / 2
        );

        for (let j = 0; j < vertices; j++) {
          const p1 = points[j];
          const p2 = points[(j + 1) % vertices];
          const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
          ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        }

        ctx.closePath();
        ctx.fillStyle = splash;
        ctx.fill();
      }

      // Reset composition mode
      ctx.globalCompositeOperation = "source-over";

      // --- MINIMALIST CARD WITH SUBTLE GLASS EFFECT ---
      ctx.save();
      // Subtle shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;

      // Create clean card path
      ctx.beginPath();
      ctx.roundRect(
        layout.padding,
        layout.padding,
        canvas.width - layout.padding * 2,
        canvas.height - layout.padding * 2,
        layout.cardRadius
      );

      // Minimal glass effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fill();

      // Thin elegant border
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = `rgba(${textColor.join(",")}, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // --- CLEAN AVATAR DISPLAY ---
      ctx.save();
      // Avatar circle clipping
      ctx.beginPath();
      ctx.arc(
        layout.avatarX + layout.avatarSize / 2,
        layout.avatarY + layout.avatarSize / 2,
        layout.avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();

      try {
        // Draw avatar with improved quality
        const avatarImg = await loadImage(avatarUrl);

        // Apply subtle sharpening/enhancement to avatar
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          avatarImg,
          layout.avatarX,
          layout.avatarY,
          layout.avatarSize,
          layout.avatarSize
        );

        // Add subtle inner shadow for depth
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        const innerShadow = ctx.createRadialGradient(
          layout.avatarX + layout.avatarSize / 2,
          layout.avatarY + layout.avatarSize / 2,
          layout.avatarSize * 0.4,
          layout.avatarX + layout.avatarSize / 2,
          layout.avatarY + layout.avatarSize / 2,
          layout.avatarSize / 2
        );
        innerShadow.addColorStop(0, "rgba(0,0,0,0)");
        innerShadow.addColorStop(1, "rgba(0,0,0,0.15)");
        ctx.fillStyle = innerShadow;
        ctx.fillRect(
          layout.avatarX,
          layout.avatarY,
          layout.avatarSize,
          layout.avatarSize
        );
        ctx.restore();
      } catch (error) {
        BotConsole.warning("[WelcomeImg] Errore caricamento avatar", error);
      }

      ctx.restore();

      // Enhanced avatar border with gradient
      ctx.save();
      const borderWidth = welcomeSettings.avatarBorderSize || 4;
      const borderGradient = ctx.createLinearGradient(
        layout.avatarX,
        layout.avatarY,
        layout.avatarX + layout.avatarSize,
        layout.avatarY + layout.avatarSize
      );

      // Create gradient using palette colors and text color
      borderGradient.addColorStop(0, textColorRgb);
      borderGradient.addColorStop(0.5, `rgba(${palette[0].join(",")}, 1)`);
      borderGradient.addColorStop(1, textColorRgb);

      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = borderWidth;
      ctx.beginPath();
      ctx.arc(
        layout.avatarX + layout.avatarSize / 2,
        layout.avatarY + layout.avatarSize / 2,
        layout.avatarSize / 2 + borderWidth / 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      // Add subtle glow
      ctx.shadowColor = textColorRgb;
      ctx.shadowBlur = 15;
      ctx.strokeStyle = `rgba(${textColor.join(",")}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // --- CLEAN TYPOGRAPHY ---
      ctx.fillStyle = textColorRgb;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;

      // Improved font selection with better Unicode character support
      let fontFamily = "Arial, 'Noto Sans', 'Segoe UI', Helvetica, sans-serif"; // Base reliable fonts

      if (fontSettings?.files && fontSettings.files.length > 0) {
        try {
          // Get all custom font names without extensions for font stack
          const customFonts = fontSettings.files
            .map((file) => `"${file.split(".")[0]}"`)
            .join(", ");

          // Custom fonts first, then system fonts with good Unicode coverage
          fontFamily = `${customFonts}, ${fontFamily}, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'`;

          BotConsole.info(`[WelcomeImg] Utilizzo font: ${customFonts}`);
        } catch (error) {
          BotConsole.warning(
            "[WelcomeImg] Errore nel caricamento dei font personalizzati, uso font di sistema",
            error
          );
        }
      }

      // --- TYPOGRAPHY & TEXT RENDERING ---

      // Helper function to draw text, handling truncation and styling
      const drawText = (
        text,
        x,
        y,
        { font, style, color, maxWidth, align = "left", baseline = "middle" }
      ) => {
        ctx.font = `${style} ${font.size}px ${font.family}`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;

        let textToDraw = text;
        if (maxWidth && ctx.measureText(text).width > maxWidth) {
          while (
            ctx.measureText(textToDraw + "…").width > maxWidth &&
            textToDraw.length > 0
          ) {
            textToDraw = textToDraw.slice(0, -1);
          }
          textToDraw = textToDraw.trim() + "…";
        }
        ctx.fillText(textToDraw, x, y, maxWidth);
      };

      // --- TEXT CONTENT & LAYOUT CONFIGURATION ---
      const textContent = {
        welcome: "Benvenuto",
        name: member.user.globalName || member.displayName || "Nuovo Membro",
        server: `nel server ${guild.name}`,
        count: `Sei il membro #${guild.memberCount}`,
      };

      const textAreaWidth =
        canvas.width - layout.textStartX - layout.padding - 20;
      const fonts = {
        welcome: {
          size: Math.max(65, Math.min(90, canvas.width * 0.09)),
          family: fontFamily,
        },
        name: {
          size: Math.max(85, Math.min(125, canvas.width * 0.12)),
          family: fontFamily,
        },
        server: {
          size: Math.max(48, Math.min(65, canvas.width * 0.065)),
          family: fontFamily,
        },
        count: {
          size: Math.max(40, Math.min(50, canvas.width * 0.05)),
          family: fontFamily,
        },
      };
      const lineSpacing = {
        welcomeToName: 15,
        nameToServer: 45,
        serverToCount: 25,
      };

      // Calculate total height for precise vertical centering
      const totalTextHeight =
        fonts.welcome.size +
        fonts.name.size +
        fonts.server.size +
        fonts.count.size +
        lineSpacing.welcomeToName +
        lineSpacing.nameToServer +
        lineSpacing.serverToCount;

      const cardInnerHeight = canvas.height - layout.padding * 2;
      let currentY = layout.padding + (cardInnerHeight - totalTextHeight) / 2;

      // 1. "Benvenuto" text - Elegant and welcoming
      currentY += fonts.welcome.size / 2;
      drawText(textContent.welcome, layout.textStartX, currentY, {
        font: fonts.welcome,
        style: "300", // Light weight for a refined look
        color: `rgba(${textColor.join(",")}, 0.8)`,
        maxWidth: textAreaWidth,
      });
      currentY += fonts.welcome.size / 2 + lineSpacing.welcomeToName;

      // 2. Member Name - The main focus, bold and impactful
      currentY += fonts.name.size / 2;
      ctx.save();
      // Add a subtle glow behind the name for emphasis
      ctx.shadowColor = `rgba(${palette[1].join(",")}, 0.7)`;
      ctx.shadowBlur = 25;
      drawText(textContent.name, layout.textStartX, currentY, {
        font: fonts.name,
        style: "800", // Extra bold
        color: textColorRgb,
        maxWidth: textAreaWidth,
      });
      ctx.restore(); // Restore from shadow effect
      currentY += fonts.name.size / 2 + lineSpacing.nameToServer;

      // --- Elegant Divider ---
      ctx.save();
      const dividerY = currentY - lineSpacing.nameToServer / 2;
      const dividerWidth = textAreaWidth * 0.4; // Shorter for a more subtle look
      const dividerX = layout.textStartX; // Align to the left of the text block
      const dividerGradient = ctx.createLinearGradient(
        dividerX,
        0,
        dividerX + dividerWidth,
        0
      );
      dividerGradient.addColorStop(0, `rgba(${textColor.join(",")}, 0.5)`);
      dividerGradient.addColorStop(1, `rgba(${textColor.join(",")}, 0)`);
      ctx.strokeStyle = dividerGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dividerX, dividerY);
      ctx.lineTo(dividerX + dividerWidth, dividerY);
      ctx.stroke();
      ctx.restore();

      // 3. Server Name
      currentY += fonts.server.size / 2;
      drawText(textContent.server, layout.textStartX, currentY, {
        font: fonts.server,
        style: "500", // Medium weight
        color: `rgba(${textColor.join(",")}, 0.9)`,
        maxWidth: textAreaWidth,
      });
      currentY += fonts.server.size / 2 + lineSpacing.serverToCount;

      // 4. Member Count
      currentY += fonts.count.size / 2;
      drawText(textContent.count, layout.textStartX, currentY, {
        font: fonts.count,
        style: "400", // Regular weight
        color: `rgba(${textColor.join(",")}, 0.7)`,
        maxWidth: textAreaWidth,
      });

      if (guild.iconURL()) {
        try {
          ctx.save();

          const iconSize = 90; // A slightly smaller, more subtle size
          // Position the icon inside the card, respecting the main padding
          const iconX = canvas.width - layout.padding - iconSize - 25;
          const iconY = canvas.height - layout.padding - iconSize - 25;

          // Load the guild icon
          const guildIconImg = await loadImage(
            guild.iconURL({ extension: "png", size: 128 })
          );

          // Create a circular clipping path for the icon
          ctx.beginPath();
          ctx.arc(
            iconX + iconSize / 2,
            iconY + iconSize / 2,
            iconSize / 2,
            0,
            Math.PI * 2
          );
          ctx.clip();

          // Draw the icon with standard blending but increased opacity for more visibility
          ctx.globalAlpha = 0.4; // Increased from 0.25 for better visibility
          ctx.drawImage(guildIconImg, iconX, iconY, iconSize, iconSize);

          // Add a more defined border that matches the card's aesthetic
          ctx.globalAlpha = 1.0; // Reset alpha for the border
          ctx.strokeStyle = `rgba(${textColor.join(",")}, 0.3)`; // Increased opacity from 0.15
          ctx.lineWidth = 2; // Increased from 1.5
          ctx.stroke(); // This will stroke the clipped circle path

          ctx.restore();
        } catch (iconError) {
          BotConsole.warning(
            "[WelcomeImg] Impossibile caricare l'icona del server.",
            iconError
          );
        }
      }

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
