import ColorFunctions from "./ColorFunctions.js";
import ColorThief from "colorthief";
import BotConsole from "../console/BotConsole.js";

class DynamicColor {
  constructor(options = {}) {
    this.img = null;
    this.threshold = options.threshold ?? 7;
    this.numColors = options.numColors ?? 5;
    this.requiredFilter = options.requiredFilter ?? true;
    this.cachedPalette = null;

    BotConsole.debug("DynamicColor instance created with options:", {
      threshold: this.threshold,
      numColors: this.numColors,
      requiredFilter: this.requiredFilter,
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
    this.cachedPalette = null; // Invalida cache
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

  sortPalette(palette, reference = [0, 0, 0]) {
    BotConsole.debug(
      `Sorting palette by distance from reference: ${reference}`
    );
    const sorted = [...palette].sort(
      (a, b) =>
        ColorFunctions.colorDistance(reference, a) -
        ColorFunctions.colorDistance(reference, b)
    );
    return sorted;
  }

  filterPalette(palette) {
    if (!Array.isArray(palette) || palette.length === 0) {
      throw new Error("Invalid or empty palette provided for filtering");
    }

    const sortedPalette = this.sortPalette(palette);

    if (!this.requiredFilter) {
      BotConsole.debug("Filtering not required, returning sorted palette.");
      return sortedPalette;
    }

    BotConsole.debug(`Filtering palette with threshold: ${this.threshold}`);
    const filtered = sortedPalette.reduce((acc, color, index, arr) => {
      if (index === 0) {
        acc.push(color);
        return acc;
      }
      const distance = ColorFunctions.colorDistance(arr[index - 1], color);
      if (distance > this.threshold) {
        acc.push(color);
      } else {
        BotConsole.debug(
          `Filtered out color ${color}. Distance to previous: ${distance.toFixed(
            2
          )}`
        );
      }
      return acc;
    }, []);

    if (filtered.length === 0) {
      BotConsole.warn("Filtering removed all colors, using dominant one.");
      return [sortedPalette[0]];
    }

    return filtered;
  }

  adjustLightness(color, avgBrightness) {
    const l = ColorFunctions.getLightness(color);
    const adjustedL =
      avgBrightness < 0.5 ? Math.min(1, l + 0.2) : Math.max(0, l - 0.2);

    BotConsole.debug(
      `Adjusting lightness: avg=${avgBrightness.toFixed(2)} ` +
        `original=${l.toFixed(2)} -> adjusted=${adjustedL.toFixed(2)}`
    );

    return ColorFunctions.setLightness(color, adjustedL);
  }

  calculateTextColor(palette) {
    if (!Array.isArray(palette) || palette.length === 0) {
      BotConsole.error("Empty palette in calculateTextColor.");
      throw new Error("Palette must be a non-empty array.");
    }

    const avgBrightness = ColorFunctions.averageBrightness(palette);
    const textColor = palette[palette.length - 1];
    const adjustedTextColor = this.adjustLightness(textColor, avgBrightness);

    const brightnessString = avgBrightness < 0.5 ? "light text" : "dark text";
    BotConsole.debug(
      `Brightness: ${avgBrightness.toFixed(2)}. Chosen ${brightnessString}.`
    );

    return adjustedTextColor;
  }

  async getPaletteAndTextColor() {
    BotConsole.debug("Starting getPaletteAndTextColor.");
    try {
      const rawPalette = await this.extractPalette();
      if (rawPalette.length < 3) {
        BotConsole.warn(
          `Palette has only ${rawPalette.length} colors. Disabling filtering.`
        );
        this.requiredFilter = false;
      }

      const filteredPalette = this.filterPalette(rawPalette);
      const textColor = this.calculateTextColor(filteredPalette);

      BotConsole.success("Palette and text color generated.");
      return { palette: filteredPalette, textColor };
    } catch (err) {
      BotConsole.error("getPaletteAndTextColor failed", err);
      throw err;
    }
  }
}

export default DynamicColor;
