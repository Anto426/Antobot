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

        // Use a color from the palette with some variation
        const colorIndex = i % palette.length;
        const color = [...palette[colorIndex]];

        // Add a slight brightness boost to make the splashes more visible
        const brightnessFactor = 1.2;
        const brightColor = color.map((c) =>
          Math.min(255, Math.round(c * brightnessFactor))
        );

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
          layout.avatarX + layout.avatarSize/2, 
          layout.avatarY + layout.avatarSize/2, 
          layout.avatarSize * 0.4,
          layout.avatarX + layout.avatarSize/2, 
          layout.avatarY + layout.avatarSize/2, 
          layout.avatarSize/2
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
        layout.avatarX + layout.avatarSize/2,
        layout.avatarY + layout.avatarSize/2,
        layout.avatarSize/2 + borderWidth/2,
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
          const customFonts = fontSettings.files.map(file => `"${file.split(".")[0]}"`).join(", ");
          
          // Custom fonts first, then system fonts with good Unicode coverage
          fontFamily = `${customFonts}, ${fontFamily}, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'`;
          
          BotConsole.info(`[WelcomeImg] Utilizzo font: ${customFonts}`);
        } catch (error) {
          BotConsole.warning("[WelcomeImg] Errore nel caricamento dei font personalizzati, uso font di sistema", error);
        }
      }

      // Improved text layout with better space management
      // Calculate responsive text sizes based on canvas dimensions - INCREASED sizes
      const fontSize = {
        name: Math.max(70, Math.min(90, canvas.width * 0.09)),        // Larger name size
        welcome: Math.max(52, Math.min(68, canvas.width * 0.067)),    // Larger welcome message
        count: Math.max(40, Math.min(55, canvas.width * 0.052))       // Larger count text
      };

      // Better vertical centering calculation
      const totalTextHeight = fontSize.name * 1.2 + fontSize.welcome + fontSize.count + 50; 
      
      const textArea = {
        // Center the text block vertically in the available space
        top: (canvas.height - totalTextHeight) / 2,
        left: layout.textStartX,
        width: canvas.width - layout.textStartX - layout.padding,
        maxWidth: Math.min(800, canvas.width - layout.textStartX - layout.padding * 1.5)
      };
      
      // Member name - with proper truncation and handling
      const memberName = member.user.globalName || member.displayName || "Nuovo Membro";
      const displayName = memberName.length > 18 ? memberName.slice(0, 18) + "..." : memberName;
      
      // Enhanced name display`
      ctx.shadowOffsetY = 3;
      ctx.fillText(displayName, textArea.left, textArea.top, textArea.maxWidth);
      ctx.restore();
      
      // Calculate text metrics for precise spacing
      ctx.font = `bold ${fontSize.name}px ${fontFamily}`;
      const nameMetrics = ctx.measureText(displayName);
      const lineHeight = fontSize.name * 1.2; // Normal line spacing
      
      // Elegant divider
      const dividerY = textArea.top + lineHeight * 0.9;
      const dividerWidth = Math.min(nameMetrics.width * 1.2, textArea.maxWidth * 0.8);
      
      const dividerGradient = ctx.createLinearGradient(
        textArea.left, dividerY,
        textArea.left + dividerWidth, dividerY
      );
      dividerGradient.addColorStop(0, textColorRgb);
      dividerGradient.addColorStop(1, `rgba(${textColor.join(",")}, 0)`);
      
      ctx.fillStyle = dividerGradient;
      ctx.fillRect(textArea.left, dividerY, dividerWidth, 4); // Thinner, more elegant line
      
      // Welcome message with balanced styling
      const welcomeY = dividerY + lineHeight * 0.6;
      const welcomeText = `Benvenuto su ${guild.name}`;
      
      ctx.save();
      ctx.font = `600 ${fontSize.welcome}px ${fontFamily}`;
      ctx.fillStyle = textColorRgb;
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillText(welcomeText, textArea.left, welcomeY, textArea.maxWidth);
      ctx.restore();
      
      // Member count with subtle styling
      const countY = welcomeY + fontSize.welcome * 1.2;
      ctx.font = `500 ${fontSize.count}px ${fontFamily}`;
      ctx.fillStyle = `rgba(${textColor.join(",")}, 0.8)`;
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;
      ctx.fillText(`Membro #${guild.memberCount}`, textArea.left, countY, textArea.maxWidth);
      
      // Subtle decorative accent
      const accentY = countY + fontSize.count * 0.7;
      const accentWidth = textArea.maxWidth * 0.6;
      const accentGradient = ctx.createLinearGradient(
        textArea.left, accentY,
        textArea.left + accentWidth, accentY
      );
      
      accentGradient.addColorStop(0, `rgba(${textColor.join(",")}, 0.6)`);
      accentGradient.addColorStop(1, `rgba(${textColor.join(",")}, 0)`);
      
      ctx.fillStyle = accentGradient;
      ctx.fillRect(textArea.left, accentY, accentWidth, 2); // Thin, elegant line

      // Subtle server icon
      if (guild.iconURL()) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        const iconSize = 100;
        const guildIconImg = await loadImage(
          guild.iconURL({ extension: "png", size: 128 })
        );
        ctx.beginPath();
        ctx.arc(
          canvas.width - iconSize / 2 - 40,
          canvas.height - iconSize / 2 - 40,
          iconSize / 2,
          0,
          Math.PI * 2
        );
        ctx.clip();
        ctx.drawImage(
          guildIconImg,
          canvas.width - iconSize - 40,
          canvas.height - iconSize - 40,
          iconSize,
          iconSize
        );
        ctx.restore();
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
