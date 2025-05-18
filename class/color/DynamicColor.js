import ColorFunctions from "./ColorFunctions.js";
import ColorThief from "colorthief";
import BotConsole from "../console/BotConsole.js";

class DynamicColor {
  constructor({ numColors = 4, threshold = 50 } = {}) {
    this.img = null;
    this.numColors = numColors;
    this.threshold = threshold;
    this.requiredFilter = true;
  }

  setImg(buffer) {
    this.img = buffer;
    BotConsole.info("Image buffer manually set");
  }

  async setImgUrl(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      this.img = Buffer.from(arrayBuffer);
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
    if (!this.img) {
      const msg = "No image set for color extraction";
      BotConsole.error(msg);
      throw new Error(msg);
    }
    return ColorThief.getPalette(this.img, this.numColors);
  }

  sortPalette(palette) {
    const sorted = [...palette].sort(
      (a, b) =>
        ColorFunctions.colorDistance([0, 0, 0], a) -
        ColorFunctions.colorDistance([0, 0, 0], b)
    );
    return sorted;
  }

  filterPalette(palette) {
    const sorted = this.sortPalette(palette);
    if (!this.requiredFilter) return sorted;

    const filtered = sorted.filter((color, idx, arr) => {
      if (idx === 0) return true;
      const prev = arr[idx - 1];
      return ColorFunctions.colorDistance(prev, color) > this.threshold;
    });

    if (filtered.length === 0) {
      const msg = "All colors filtered out";
      BotConsole.warning(msg);
      throw new Error(msg);
    }

    return filtered;
  }

  calculateTextColor(palette) {
    const avg = ColorFunctions.averageColor(palette);
    let text = ColorFunctions.getOppositeColor(avg);
    let [h, s, l] = ColorFunctions.rgbToHsl(...text);

    if (l > 0.7) l = Math.max(0, l - 0.3);
    else if (l < 0.3) l = Math.min(1, l + 0.3);
    else if (l > 0.5) l -= 0.2;
    else l += 0.2;

    text = ColorFunctions.hslToRgb(h, s, l);
    return text.map((c) => Math.round(Math.max(0, Math.min(255, c))));
  }

  async getPaletteAndTextColor() {
    try {
      let palette = await this.extractPalette();
      if (palette.length < 3) this.requiredFilter = false;
      const finalPalette = this.filterPalette(palette);
      const textColor = this.calculateTextColor(finalPalette);
      BotConsole.success("Palette and text color generated");
      return { palette: finalPalette, textColor };
    } catch (err) {
      BotConsole.error("Error in getPaletteAndTextColor", err);
      throw err;
    }
  }
}

export default DynamicColor;
