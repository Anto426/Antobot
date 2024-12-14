import moment from "moment";
import chalk from "chalk";

class BotConsole {
  static #instance;

  static #DEFAULT_CONFIG = {
    showTimestamp: true,
    timeFormat: "HH:mm:ss.SSS",
    showSource: true,
    indentSize: 2,
    theme: {
      symbols: {
        info: "ℹ",
        success: "✓",
        warning: "!",
        error: "✕",
        debug: "⚙",
        trace: "→",
        tree: {
          branch: "├──",
          last: "└──",
          vertical: "│  ",
          space: "   ",
        },
      },
      styles: {
        info: { color: "blue", symbol: "info" },
        success: { color: "green", symbol: "success" },
        warning: { color: "yellow", symbol: "warning" },
        error: { color: "red", symbol: "error" },
        debug: { color: "magenta", symbol: "debug" },
        trace: { color: "cyan", symbol: "trace" },
      },
    },
  };

  #config;

  constructor(config = {}) {
    if (BotConsole.#instance) return BotConsole.#instance;
    this.#config = { ...BotConsole.#DEFAULT_CONFIG, ...config };
    BotConsole.#instance = this;
  }

  #formatHeader(text) {
    const width = 80;
    const line = "═".repeat(width);
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    const centeredText = " ".repeat(padding) + text;
    return `\n${chalk.cyan(line)}\n${chalk.bold.white(
      centeredText
    )}\n${chalk.cyan(line)}`;
  }

  #formatMessage(type, message) {
    const { showTimestamp, timeFormat, theme } = this.#config;
    const style = theme.styles[type];
    const timestamp = showTimestamp
      ? chalk.gray(`[${moment().format(timeFormat)}] `)
      : "";
    const symbol = chalk[style.color](` ${theme.symbols[style.symbol]} `);

    return `${timestamp}${symbol} ${message}`;
  }

  #formatTree(data, level = 0, isLast = true, prefix = "") {
    const { theme } = this.#config;
    const { branch, last, vertical, space } = theme.symbols.tree;
    let result = "";

    if (typeof data === "object" && data !== null) {
      const entries = Object.entries(data);
      entries.forEach(([key, value], index) => {
        const isLastItem = index === entries.length - 1;
        const symbol = isLastItem ? last : branch;
        const line = `${prefix}${symbol} ${chalk.yellow(key)}: `;
        result += line;

        if (typeof value === "object" && value !== null) {
          result += "\n";
          const newPrefix = prefix + (isLastItem ? space : vertical);
          result += this.#formatTree(value, level + 1, isLastItem, newPrefix);
        } else {
          result += `${chalk.white(value)}\n`;
        }
      });
    }
    return result;
  }

  log(message, type = "info", data = null) {
    console.log(this.#formatMessage(type, message));
    if (data) {
      console.log(this.#formatTree(data));
    }
  }

  section(title) {
    console.log(this.#formatHeader(title.toUpperCase()));
  }

  success(message, data) {
    this.log(message, "success", data);
  }
  error(message, data) {
    this.log(message, "error", data);
  }
  warning(message, data) {
    this.log(message, "warning", data);
  }
  info(message, data) {
    this.log(message, "info", data);
  }
  debug(message, data) {
    this.log(message, "debug", data);
  }
  trace(message, data) {
    this.log(message, "trace", data);
  }
}

export default new BotConsole();
