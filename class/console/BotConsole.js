import moment from "moment";
import chalk from "chalk";
import gradient from "gradient-string";

class BotConsole {
  static #instance;

  static #DEFAULT_CONFIG = {
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
        info: ["#4facfe", "#00f2fe"], // Light blue
        success: ["#67B26F", "#4ca2cd"], // Soft green
        warning: ["#f6d365", "#fda085"], // Warm orange
        error: ["#ee0979", "#ff6a00"], // Strong red
        debug: ["#764ba2", "#667eea"], // Gentle purple
        trace: ["#74ebd5", "#9face6"], // Cool turquoise
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

  #config;
  #gradient = gradient;

  constructor(config = {}) {
    if (BotConsole.#instance) return BotConsole.#instance;
    this.#config = { ...BotConsole.#DEFAULT_CONFIG, ...config };
    BotConsole.#instance = this;
  }

  #formatHeader(text) {
    const width = process.stdout.columns || 80;
    const line = "━".repeat(width);
    const padding = Math.max(0, Math.floor((width - text.length - 2) / 2));
    const headerGradient = this.#gradient(["#FF69B4", "#4facfe"]);
    const paddedText = " ".repeat(padding) + text + " ".repeat(padding);

    return [
      "",
      headerGradient(`┏${line}┓`),
      `${headerGradient("┃")}${this.#gradient.cristal(
        paddedText
      )}${headerGradient("┃")}`,
      headerGradient(`┗${line}┛`),
    ].join("\n");
  }

  #formatMessage(type, messages) {
    const {
      showTimestamp,
      timeFormat,
      theme: { styles, gradients, symbols },
    } = this.#config;
    const style = styles[type];
    const messageGradient = this.#gradient(gradients[type]);

    const parts = [
      showTimestamp && chalk.gray(`[${moment().format(timeFormat)}]`),
      messageGradient(`【${style.label}】`),
      symbols[style.symbol],
      messageGradient(messages.join(" ")),
    ].filter(Boolean);

    return parts.join(" ");
  }

  #formatValue(value, type = "info") {
    const messageGradient = this.#gradient(this.#config.theme.gradients[type]);

    const formatters = {
      null: () => chalk.gray.italic("✗ null"),
      undefined: () => chalk.gray.italic("✗ undefined"),
      string: (v) => messageGradient(`"${v}"`),
      number: (v) => messageGradient(`❪${v}❫`),
      boolean: (v) => messageGradient(`⟦${v}⟧`),
      date: (v) => messageGradient(`📅 ${v.toISOString()}`),
      array: (v) => messageGradient(`[${v.length}]⚊Array`),
      function: () => messageGradient("⚡Function"),
      object: () => messageGradient("⚋Object"),
    };

    if (value === null) return formatters.null();
    if (value === undefined) return formatters.undefined();
    if (value instanceof Date) return formatters.date(value);

    return formatters[typeof value]?.(value) || messageGradient(String(value));
  }

  #formatTree(data, type = "info", level = 0, isLast = true, prefix = "") {
    const { tree } = this.#config.theme.symbols;
    const messageGradient = this.#gradient(this.#config.theme.gradients[type]);

    if (data === null || data === undefined || typeof data !== "object") {
      return this.#formatValue(data, type) + "\n";
    }

    return Object.entries(data).reduce(
      (result, [key, value], index, entries) => {
        const isLastItem = index === entries.length - 1;
        const symbol = isLastItem ? tree.last : tree.branch;
        const line = `${prefix}${messageGradient(symbol)} ${messageGradient(
          key
        )}: `;

        if (typeof value === "object" && value !== null) {
          const newPrefix = prefix + (isLastItem ? tree.space : tree.vertical);
          return (
            result +
            line +
            "\n" +
            this.#formatTree(value, type, level + 1, isLastItem, newPrefix)
          );
        }

        return result + line + this.#formatValue(value, type) + "\n";
      },
      ""
    );
  }

  log(type = "info", ...args) {
    const messages = args.filter((arg) => typeof arg !== "object");
    const data = args.find((arg) => typeof arg === "object" && arg !== null);

    console.log(this.#formatMessage(type, messages));
    if (data) {
      console.log(this.#formatTree(data, type));
    }
  }

  section(title) {
    console.log(this.#formatHeader(title.toUpperCase()));
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
