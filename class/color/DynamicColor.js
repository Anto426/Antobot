import ColorFunctions from "./ColorFunctions.js";
import ColorThief from "colorthief";
import BotConsole from "../console/BotConsole.js";


class DynamicColor {
 
  constructor(options = {}) {
    this.img = null;
    this.threshold = options.threshold ?? 30;
    this.numColors = options.numColors ?? 5;
    this.cachedPalette = null;

    BotConsole.debug("Istanza DynamicColor creata", {
      threshold: this.threshold,
      numColors: this.numColors,
    });
  }

 
  setConfig({ img, threshold, numColors } = {}) {
    BotConsole.debug("Impostazione nuova configurazione", { img: !!img, threshold, numColors });
    if (img) this.setImg(img);
    if (threshold !== undefined) this.setThreshold(threshold);
    if (numColors !== undefined) this.setNumColors(numColors);
  }
  
 
  setImg(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError("L'immagine deve essere un Buffer valido.");
    }
    this.img = buffer;
    this.cachedPalette = null; 
    BotConsole.info("Buffer immagine impostato manualmente.");
  }


  async setImgUrl(url) {
    BotConsole.debug(`Recupero immagine da: ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      this.setImg(Buffer.from(arrayBuffer));
      BotConsole.success("Immagine caricata nel buffer.");
    } catch (err) {
      BotConsole.error("Fallimento recupero immagine", err);
      throw err;
    }
  }
  

  setThreshold(value) {
    if (typeof value === 'number' && !isNaN(value)) {
      this.threshold = value;
      BotConsole.debug(`Threshold impostato a ${value}`);
    }
  }


  setNumColors(n) {
    this.numColors = n;
    BotConsole.debug(`Numero di colori impostato a ${n}`);
  }


 
  async extractPalette() {
    if (this.cachedPalette) {
      BotConsole.debug("Restituzione palette da cache.");
      return this.cachedPalette;
    }
    if (!this.img) {
      throw new Error("Nessuna immagine impostata per l'estrazione della palette.");
    }
    const colorsToExtract = this.numColors + 5;
    BotConsole.debug(`Estrazione di ${colorsToExtract} colori dall'immagine.`);
    try {
      const palette = await ColorThief.getPalette(this.img, colorsToExtract);
      this.cachedPalette = palette;
      return palette;
    } catch (error) {
      BotConsole.error("Fallimento estrazione palette", error);
      throw error;
    }
  }

 
  sortPaletteByBrightness(palette) {
    if (!Array.isArray(palette) || palette.length <= 1) return palette;
    return [...palette].sort(
      (a, b) => ColorFunctions.getBrightness(a) - ColorFunctions.getBrightness(b)
    );
  }
 
  interpolateColor(colorA, colorB, ratio = 0.5) {
      const r = (val) => Math.round(val);
      const clamp = (v) => Math.min(1, Math.max(0, v));
      ratio = clamp(ratio);
      return [
        r(colorA[0] + (colorB[0] - colorA[0]) * ratio),
        r(colorA[1] + (colorB[1] - colorA[1]) * ratio),
        r(colorA[2] + (colorB[2] - colorA[2]) * ratio),
      ];
  }

  calculateTextColor(palette) {
      if (!Array.isArray(palette) || palette.length === 0) {
        throw new Error("La palette deve essere un array non vuoto.");
      }
      const sorted = this.sortPaletteByBrightness(palette);
      const darkest = sorted[0];
      const lightest = sorted[sorted.length - 1];
      const avgBrightness = ColorFunctions.averageBrightness(sorted);
      
      const baseTextColor = avgBrightness > 128 ? darkest : lightest;
      return this.adjustLightness(baseTextColor, avgBrightness);
  }


  adjustLightness(color, avgBgBrightness) {
     const [h, s, l] = ColorFunctions.rgbToHsl(...color);
     const isDarkBg = avgBgBrightness < 128;
     
     if (s < 0.1) return isDarkBg ? [255, 255, 255] : [0, 0, 0];

     let newL = l;
     if (isDarkBg && l < 0.65) newL = 0.85;  
     if (!isDarkBg && l > 0.35) newL = 0.15;  
     
     return ColorFunctions.hslToRgb(h, s, newL).map(Math.round);
  }


  _calculateAverageDistance(palette) {
    if (!Array.isArray(palette) || palette.length < 2) {
      BotConsole.error("Per calcolare la distanza media sono necessari almeno due colori.");
      return null;
    }
    const distances = [];
    for (let i = 0; i < palette.length - 1; i++) {
      const distance = ColorFunctions.colorDistance(palette[i], palette[i + 1]);
      if (!isNaN(distance)) distances.push(distance);
    }
    if (distances.length === 0) return null;
    const average = distances.reduce((sum, value) => sum + value, 0) / distances.length;
    return Math.round(average);
  }

  _filterDistinctColors(palette, minDistance) {
    if (!Array.isArray(palette) || palette.length <= 1) return palette;

    const sorted = this.sortPaletteByBrightness(palette);
    const filtered = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const isDistinctEnough = filtered.every(
        (keptColor) => ColorFunctions.colorDistance(current, keptColor) >= minDistance
      );
      if (isDistinctEnough) {
        filtered.push(current);
      }
    }
    BotConsole.debug(`Palette filtrata da ${palette.length} a ${filtered.length} colori con distanza minima ${minDistance}.`);
    return filtered;
  }


  _generateGradientPalette(startColor, endColor, steps) {
    if (!Array.isArray(startColor) || !Array.isArray(endColor) || steps < 1) {
      throw new Error("Input non valido per _generateGradientPalette");
    }
    if (steps === 1) return [startColor.map(Math.round)];

    const palette = [];
    const intervals = steps > 1 ? steps - 1 : 1;

    for (let i = 0; i < steps; i++) {
      const ratio = i / intervals;
      palette.push(this.interpolateColor(startColor, endColor, ratio));
    }
    return palette;
  }


  async getPaletteAndTextColor() {
    BotConsole.debug("Avvio processo getPaletteAndTextColor.");
    try {
      const rawPalette = await this.extractPalette();

      const averageDistance = this._calculateAverageDistance(rawPalette);
      if (averageDistance !== null) {
        this.setThreshold(averageDistance);
      }
      
      const distinctPalette = this._filterDistinctColors(rawPalette, this.threshold);

      let finalPalette;
      if (distinctPalette.length >= this.numColors) {
        finalPalette = distinctPalette.slice(0, this.numColors);
      } else {
        const base = distinctPalette.length > 0 ? distinctPalette : rawPalette;
        const sorted = this.sortPaletteByBrightness(base);
        const darkest = sorted[0];
        const lightest = sorted[sorted.length - 1];
        finalPalette = this._generateGradientPalette(darkest, lightest, this.numColors);
      }

      const textColor = this.calculateTextColor(finalPalette);
      const averageColorRgb = ColorFunctions.averageColor(finalPalette);

      BotConsole.success("Palette e colore del testo generati con successo.");
      return {
        palette: finalPalette,
        textColor,
        averageColorRgb,
      };
    } catch (err) {
      BotConsole.error("getPaletteAndTextColor fallito", err);
      throw err;
    }
  }
}

export default DynamicColor;