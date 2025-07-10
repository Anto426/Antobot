class ColorFunctions {
  #normalizeRGB(color) {
    return color.map((v) => v / 255);
  }

  #denormalizeRGB(color) {
    return color.map((v) => Math.round(v * 255));
  }

  #hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  // === RGB <-> HSL ===
  rgbToHsl(r, g, b) {
    [r, g, b] = this.#normalizeRGB([r, g, b]);

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  hslToRgb(h, s, l) {
    if (s === 0) {
      const gray = Math.round(l * 255);
      return [gray, gray, gray];
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return this.#denormalizeRGB([
      this.#hue2rgb(p, q, h + 1 / 3),
      this.#hue2rgb(p, q, h),
      this.#hue2rgb(p, q, h - 1 / 3),
    ]);
  }

  // === Color Operations ===
  averageColor(colors) {
    const sum = colors.reduce(
      (acc, [r, g, b]) => {
        acc[0] += r;
        acc[1] += g;
        acc[2] += b;
        return acc;
      },
      [0, 0, 0]
    );

    const len = colors.length;
    return sum.map((v) => Math.round(v / len));
  }

  averageBrightness(colors) {
    const total = colors.reduce(
      (sum, [r, g, b]) => sum + (0.299 * r + 0.587 * g + 0.114 * b),
      0
    );
    return total / colors.length / 255;
  }

  colorDistance(c1, c2) {
    return Math.sqrt(c1.reduce((sum, v, i) => sum + (v - c2[i]) ** 2, 0));
  }

  diffColor(c1, c2) {
    return c1.map((v, i) => v - c2[i]);
  }

  arrayToRgb([r, g, b]) {
    return `rgb(${r}, ${g}, ${b})`;
  }

  rgbToHex(r, g, b) {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }

  getOppositeColor([r, g, b]) {
    return [255 - r, 255 - g, 255 - b];
  }

  getLightness(color) {
    const [r, g, b] = this.#normalizeRGB(color);
    return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
  }

  setLightness(color, newL) {
    const [h, s] = this.rgbToHsl(...color);
    return this.hslToRgb(h, s, newL);
  }

  getHue(color) {
    const [h] = this.rgbToHsl(...color);
    return h;
  }

  getBrightness([r, g, b]) {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
}


export default new ColorFunctions();