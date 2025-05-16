import chalk from "chalk";
import gradient from "gradient-string";

const DEFAULT_CONFIG = {
  showTimestamp: true,
  timeFormat: "HH:mm:ss.SSS",
  theme: {
    symbols: {
      info: "💠",
      success: "✅",
      warning: "⚠️",
      error: "❌",
      debug: "🔧",
      trace: "📍",
      tree: {
        branch: "├──",
        last: "└──",
        vertical: "│  ",
        space: "   ",
      },
    },
    gradients: {
      info: ["#4facfe", "#00f2fe"],
      success: ["#67B26F", "#4ca2cd"],
      warning: ["#f6d365", "#fda085"],
      error: ["#ee0979", "#ff6a00"],
      debug: ["#764ba2", "#667eea"],
      trace: ["#74ebd5", "#9face6"],
    },
    styles: {
      info: { symbol: "info", label: "INFO" },
      success: { symbol: "success", label: "SUCCESS" },
      warning: { symbol: "warning", label: "WARNING" },
      error: { symbol: "error", label: "ERROR" },
      debug: { symbol: "debug", label: "DEBUG" },
      trace: { symbol: "trace", label: "TRACE" },
    },
  },
};

class BotConsole {
  static _instance;

  constructor(config = {}) {
    if (BotConsole._instance) return BotConsole._instance;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      theme: {
        ...DEFAULT_CONFIG.theme,
        ...config.theme,
      },
    };
    BotConsole._instance = this;
  }

  // --- HELPERS ---
  _getGradient(type) {
    const stops =
      this.config.theme.gradients[type] || DEFAULT_CONFIG.theme.gradients[type];
    return gradient(stops);
  }

  _timestamp() {
    if (!this.config.showTimestamp) return "";
    const t = new Date().toISOString().slice(11, -1);
    return chalk.gray(`[${t}]`);
  }

  _getStyle(type) {
    return this.config.theme.styles[type] || DEFAULT_CONFIG.theme.styles[type];
  }

  _getSymbol(type) {
    const style = this._getStyle(type);
    return this.config.theme.symbols[style.symbol];
  }

  // --- HEADER ---
  formatHeader(text) {
    const width = process.stdout.columns || 80;
    const line = "━".repeat(width);
    const pad = Math.max(0, Math.floor((width - text.length - 2) / 2));
    const grad = gradient(["#FF69B4", "#4facfe"]);

    return [
      "",
      grad(`┏${line}┓`),
      grad("┃") +
        gradient.cristal(" ".repeat(pad) + text + " ".repeat(pad)) +
        grad("┃"),
      grad(`┗${line}┛`),
    ].join("\n");
  }

  // --- MESSAGE ---
  formatMessage(type, parts) {
    const grad = this._getGradient(type);
    const style = this._getStyle(type);
    const ts = this._timestamp();
    const label = grad(`【${style.label}】`);
    const symbol = this._getSymbol(type);
    const content = grad(parts.join(" "));
    return [ts, label, symbol, content].filter(Boolean).join(" ");
  }

  // --- VALUE PREVIEW ---
  formatValue(value, type) {
    const grad = this._getGradient(type);
    if (value == null) {
      return chalk.gray.italic(`✗ ${value}`);
    }
    if (Array.isArray(value)) {
      const preview = value.slice(0, 3).join(", ");
      return grad(
        `[${value.length}]⟦${preview}${value.length > 3 ? "…" : ""}⟧`
      );
    }
    if (value instanceof Date) {
      return grad(`📅 ${value.toISOString()}`);
    }
    if (value instanceof Error) {
      return grad(`🔥 Error: ${value.message}`);
    }
    switch (typeof value) {
      case "string":
        return grad(`"${value}"`);
      case "number":
        return grad(`❪${value}❫`);
      case "boolean":
        return grad(`⟦${value}⟧`);
      case "function":
        return grad(`⚡ fn:${value.name || "anon"}`);
      case "object": {
        const keys = Object.keys(value);
        const preview = keys
          .slice(0, 3)
          .map((k) => `${k}:${value[k]}`)
          .join(", ");
        return grad(
          `{${keys.length}}⚋{${preview}${keys.length > 3 ? "…" : ""}}`
        );
      }
      default:
        return grad(String(value));
    }
  }

  // --- TREE ---
  formatTree(obj, type, prefix = "") {
    const { branch, last, vertical, space } = this.config.theme.symbols.tree;
    const grad = this._getGradient(type);

    if (obj == null || typeof obj !== "object") {
      return this.formatValue(obj, type);
    }

    return Object.entries(obj)
      .map(([key, val], idx, arr) => {
        const isLast = idx === arr.length - 1;
        const symbol = isLast ? last : branch;
        const line = prefix + grad(`${symbol} ${key}: `);
        const nextPrefix = prefix + (isLast ? space : vertical);

        if (val != null && typeof val === "object") {
          return `${line}\n${this.formatTree(val, type, nextPrefix)}`;
        }
        return line + this.formatValue(val, type);
      })
      .join("\n");
  }

  // --- OUTPUT ---
  write(type, ...args) {
    const messages = args.filter((a) => typeof a !== "object");
    const objects = args.filter((a) => a && typeof a === "object");

    console.log(this.formatMessage(type, messages));
    objects.forEach((obj) => console.log(this.formatTree(obj, type)));
  }

  section(title) {
    console.log(this.formatHeader(title.toUpperCase()));
  }
}

// auto‐generate level methods
["info", "success", "warning", "error", "debug", "trace"].forEach((level) => {
  BotConsole.prototype[level] = function (...args) {
    return this.write(level, ...args);
  };
});

export default new BotConsole();
