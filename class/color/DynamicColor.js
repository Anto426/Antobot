import ColorFunctions from "./ColorFunctions.js";
import ColorThief from "colorthief";
import BotConsole from "../console/BotConsole.js";

class DynamicColor {
  constructor(options = {}) {
    this.img = null;
    this.threshold = options.threshold ?? 70;
    this.numColors = options.numColors ?? 8;
    this.cachedPalette = null;

    BotConsole.debug("DynamicColor instance created with options:", {
      threshold: this.threshold,
      numColors: this.numColors,
    });
  }

  setConfig({ img, threshold, numColors } = {}) {
    BotConsole.debug("Setting new configuration:", {
      img: !!img,
      threshold,
      numColors,
    });
    if (img) this.setImg(img);
    if (threshold !== undefined) this.setThreshold(threshold);
    if (numColors !== undefined) this.setNumColors(numColors);
  }

  setImg(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      BotConsole.error("setImg: Provided input is not a Buffer.");
      throw new TypeError("Image must be a valid Buffer.");
    }
    this.img = buffer;
    this.cachedPalette = null;
    BotConsole.info("Image buffer manually set");
  }

  async setImgUrl(url) {
    BotConsole.debug(`Fetching image from URL: ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      this.setImg(Buffer.from(arrayBuffer));
      BotConsole.success("Image loaded into buffer");
    } catch (err) {
      BotConsole.error("Failed to fetch image", err);
      throw err;
    }
  }

  setThreshold(value) {
    this.threshold = value;
    BotConsole.debug(`Threshold set to ${value}`);
  }

  setNumColors(n) {
    this.numColors = n;
    BotConsole.debug(`Number of colors to extract set to ${n}`);
  }

  async extractPalette() {
    if (this.cachedPalette) {
      BotConsole.debug("Returning cached palette.");
      return this.cachedPalette;
    }

    if (!this.img) {
      BotConsole.error("No image has been set for palette extraction.");
      throw new Error("No image has been set");
    }

    BotConsole.debug(`Extracting ${this.numColors} colors from image.`);
    try {
      const palette = await ColorThief.getPalette(this.img, this.numColors);
      this.cachedPalette = palette;
      return palette;
    } catch (error) {
      BotConsole.error("Failed to extract palette", error);
      throw error;
    }
  }

  sortPalette(palette) {
    return palette.slice().sort((a, b) => {
      const brightnessA = ColorFunctions.getBrightness(a);
      const brightnessB = ColorFunctions.getBrightness(b);
      return brightnessA - brightnessB;
    });
  }

  interpolateColor(colorA, colorB, ratio = 0.5) {
    if (
      !Array.isArray(colorA) ||
      !Array.isArray(colorB) ||
      colorA.length !== 3 ||
      colorB.length !== 3
    ) {
      throw new Error("Invalid colors provided to interpolateColor");
    }

    const clamp = (v) => Math.min(1, Math.max(0, v));
    ratio = clamp(ratio);

    return [
      Math.round(colorA[0] + (colorB[0] - colorA[0]) * ratio),
      Math.round(colorA[1] + (colorB[1] - colorA[1]) * ratio),
      Math.round(colorA[2] + (colorB[2] - colorA[2]) * ratio),
    ];
  }

  _generateGradientPalette(startColor, endColor, steps) {
    if (!Array.isArray(startColor) || !Array.isArray(endColor) || steps < 1) {
      throw new Error("Invalid input to _generateGradientPalette");
    }

    if (steps === 1) return [startColor.map(Math.round)];
    if (steps === 2)
      return [startColor.map(Math.round), endColor.map(Math.round)];

    const palette = [];
    const intervals = steps - 1;

    for (let i = 0; i <= intervals; i++) {
      const ratio = i / intervals;
      const color = this.interpolateColor(startColor, endColor, ratio);

      if (
        palette.length === 0 ||
        ColorFunctions.colorDistance(palette[palette.length - 1], color) <=
          this.threshold ||
        i === intervals
      ) {
        palette.push(color);
      }
    }

    while (palette.length < steps) {
      palette.push(endColor.map(Math.round));
    }

    // Se troppo lunga, riduci equamente
    if (palette.length > steps) {
      const reduced = [];
      const step = (palette.length - 1) / (steps - 1);
      for (let i = 0; i < steps; i++) {
        reduced.push(palette[Math.round(i * step)]);
      }
      return reduced;
    }

    return palette;
  }

  filterPalette(palette) {
    if (!Array.isArray(palette) || palette.length === 0) {
      BotConsole.error("Invalid or empty palette provided for filtering.");
      throw new Error("Invalid or empty palette provided for filtering");
    }

    const sorted = this.sortPalette(palette);

    BotConsole.debug(`Filtering palette with threshold: ${this.threshold}`);
    const filtered = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const prev = filtered[filtered.length - 1];
      const current = sorted[i];
      const distance = Math.abs(ColorFunctions.colorDistance(current, prev));

      if (distance < this.threshold) {
        BotConsole.debug(
          `Distance ${distance.toFixed(2)} < threshold, keeping color.`
        );
        filtered.push(current);
      } else {
        BotConsole.debug(
          `Distance ${distance.toFixed(2)} >= threshold, interpolating...`
        );
        const mid = this.interpolateColor(prev, current);
        filtered.push(mid);
      }
    }

    if (filtered.length < this.numColors) {
      const needed = this.numColors - filtered.length;
      const fill = this._generateGradientPalette(
        filtered[0],
        filtered[filtered.length - 1],
        needed + 2
      ).slice(1, -1);
      return [...filtered, ...fill.slice(0, needed)];
    }

    if (filtered.length > this.numColors) {
      const reduced = [];
      const step = (filtered.length - 1) / (this.numColors - 1);
      for (let i = 0; i < this.numColors; i++) {
        reduced.push(filtered[Math.round(i * step)]);
      }
      BotConsole.debug(`Reduced palette to ${this.numColors} colors.`);
      return reduced;
    }

    return filtered;
  }

  adjustLightness(color, avgBrightness) {
    const [r, g, b] = color;
    const [h, s, l] = ColorFunctions.rgbToHsl(r, g, b);

    const BRIGHTNESS_THRESHOLD = 128;
    const TARGET_LIGHTNESS_DARK_BG = 0.85; // Light text for dark backgrounds
    const TARGET_LIGHTNESS_LIGHT_BG = 0.15; // Dark text for light backgrounds
    const SATURATION_THRESHOLD = 0.1;
    const LIGHTNESS_ADJUST_THRESHOLD_DARK = 0.65;
    const LIGHTNESS_ADJUST_THRESHOLD_LIGHT = 0.35;

    const isDarkBg = avgBrightness < BRIGHTNESS_THRESHOLD;

    // For very low saturation colors (grays), return pure white or black for max contrast.
    if (s < SATURATION_THRESHOLD) {
      return isDarkBg ? [255, 255, 255] : [0, 0, 0];
    }

    let newLightness = l;
    if (isDarkBg) {
      // If background is dark, make text lighter if it's not already light enough.
      if (l < LIGHTNESS_ADJUST_THRESHOLD_DARK) {
        newLightness = TARGET_LIGHTNESS_DARK_BG;
      }
    } else {
      // If background is light, make text darker if it's not already dark enough.
      if (l > LIGHTNESS_ADJUST_THRESHOLD_LIGHT) {
        newLightness = TARGET_LIGHTNESS_LIGHT_BG;
      }
    }

    const [newR, newG, newB] = ColorFunctions.hslToRgb(h, s, newLightness);
    return [Math.round(newR), Math.round(newG), Math.round(newB)];
  }

  calculateTextColor(palette) {
    if (!Array.isArray(palette) || palette.length === 0) {
      BotConsole.error("Empty palette in calculateTextColor.");
      throw new Error("Palette must be a non-empty array.");
    }

    const darkestColor = palette[0];
    const lightestColor = palette[palette.length - 1];

    const avgBrightness = ColorFunctions.averageBrightness(palette);
    const BRIGHTNESS_THRESHOLD = 128;

    let baseTextColor;
    if (avgBrightness > BRIGHTNESS_THRESHOLD) {
      BotConsole.debug(
        `Bright palette (avg: ${avgBrightness.toFixed(
          2
        )}), using darkest color for text.`
      );
      baseTextColor = darkestColor;
    } else {
      BotConsole.debug(
        `Dark palette (avg: ${avgBrightness.toFixed(
          2
        )}), using lightest color for text.`
      );
      baseTextColor = lightestColor;
    }

    return this.adjustLightness(baseTextColor, avgBrightness);
  }

  async getPaletteAndTextColor() {
    BotConsole.debug("Starting getPaletteAndTextColor.");
    try {
      const rawPalette = await this.extractPalette();
      if (rawPalette.length < 3) {
        BotConsole.warning(
          `Palette has only ${rawPalette.length} colors. Disabling filtering.`
        );
      }

      const filteredPalette = this.filterPalette(rawPalette);
      const textColor = this.calculateTextColor(filteredPalette);
      let averageColorRgb = ColorFunctions.averageColor(filteredPalette);

      BotConsole.success("Palette and text color generated.");
      return {
        palette: filteredPalette,
        textColor,
        averageColorRgb,
      };
    } catch (err) {
      BotConsole.error("getPaletteAndTextColor failed", err);
      throw err;
    }
  }
}

export default DynamicColor;
