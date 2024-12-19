import chalk from "chalk";
import gradient from "gradient-string";

class BotConsole {
  static instance = null;

  static DEFAULT_CONFIG = {
    showTimestamp: true,
    timeFormat: "HH:mm:ss.SSS",
    showSource: true,
    indentSize: 2,
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
          arrow: "→",
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

  constructor(config = {}) {
    if (BotConsole.instance) return BotConsole.instance;
    this.config = { ...BotConsole.DEFAULT_CONFIG, ...config };
    BotConsole.instance = this;
  }

  formatHeader(text) {
    const width = process.stdout.columns || 80;
    const line = "━".repeat(width);
    const padding = Math.max(0, Math.floor((width - text.length - 2) / 2));
    const headerGradient = gradient(["#FF69B4", "#4facfe"]);
    const paddedText = " ".repeat(padding) + text + " ".repeat(padding);

    return [
      "",
      headerGradient(`┏${line}┓`),
      `${headerGradient("┃")}${gradient.cristal(paddedText)}${headerGradient(
        "┃"
      )}`,
      headerGradient(`┗${line}┛`),
    ].join("\n");
  }

  formatMessage(type, messages) {
    const { showTimestamp, theme } = this.config;
    const { styles, gradients, symbols } = theme;
    const style = styles[type];
    const messageGradient = gradient(gradients[type]);

    const timestamp = showTimestamp
      ? chalk.gray(`[${new Date().toISOString().slice(11, -1)}]`)
      : "";

    const parts = [
      timestamp,
      messageGradient(`【${style.label}】`),
      symbols[style.symbol],
      messageGradient(messages.join(" ")),
    ].filter(Boolean);

    return parts.join(" ");
  }

  formatValue(value, type = "info") {
    const messageGradient = gradient(this.config.theme.gradients[type]);

    if (value === null) return chalk.gray.italic("✗ null");
    if (value === undefined) return chalk.gray.italic("✗ undefined");

    console.log(typeof value, value);
    switch (typeof value) {
      case "string":
        return messageGradient(`"${value}"`);
      case "number":
        return messageGradient(`❪${value}❫`);
      case "boolean":
        return messageGradient(`⟦${value}⟧`);
      case "object":
        if (value instanceof Date) {
          return messageGradient(`📅 ${value.toISOString()}`);
        } else if (value instanceof Error) {
          const errorInfo = {
            name: value.name,
            message: value.message,
            stack: value.stack?.split("\n")[0],
            code: value.code,
            cause: value.cause,
          };
          return messageGradient(`🔥 Error: ${JSON.stringify(errorInfo)}`);
        } else if (Array.isArray(value)) {
          return messageGradient(
            `[${value.length}]⚊Array ${value.slice(0, 3).join(", ")}...`
          );
        } else {
          const keys = Object.keys(value || {});
          const preview = keys
            .slice(0, 3)
            .map((k) => `${k}: ${value[k]}`)
            .join(", ");
          return messageGradient(`{${keys.length}}⚋Object {${preview}}...`);
        }
      case "function":
        return messageGradient(`⚡Function: ${value.name || "anonymous"}`);
      default:
        return messageGradient(String(value));
    }
  }

  formatTree(data, type = "info", prefix = "") {
    const { tree } = this.config.theme.symbols;
    const messageGradient = gradient(this.config.theme.gradients[type]);

    if (typeof data !== "object" || data === null) {
      return this.formatValue(data, type) + "\n";
    }

    const entries = Object.entries(data);
    return entries
      .map(([key, value], index) => {
        const isLastItem = index === entries.length - 1;
        const symbol = isLastItem ? tree.last : tree.branch;
        const linePrefix = prefix + messageGradient(`${symbol} ${key}: `);

        if (typeof value === "object" && value !== null) {
          const newPrefix = prefix + (isLastItem ? tree.space : tree.vertical);
          return linePrefix + "\n" + this.formatTree(value, type, newPrefix);
        }

        return linePrefix + this.formatValue(value, type);
      })
      .join("\n");
  }

  log(type = "info", ...args) {
    const messages = args.filter((arg) => typeof arg !== "object");
    const data = args.find((arg) => typeof arg === "object" && arg !== null);

    console.log(this.formatMessage(type, messages));
    if (data) {
      console.log(this.formatTree(data, type));
    }
  }

  section(title) {
    console.log(this.formatHeader(title.toUpperCase()));
  }

  success(...args) {
    this.log("success", ...args);
  }

  error(...args) {
    this.log("error", ...args);
  }

  warning(...args) {
    this.log("warning", ...args);
  }

  info(...args) {
    this.log("info", ...args);
  }

  debug(...args) {
    this.log("debug", ...args);
  }

  trace(...args) {
    this.log("trace", ...args);
  }
}

export default new BotConsole();
