import chalk from "chalk";
import gradient from "gradient-string";
import boxen from "boxen";

const DEFAULT_CONFIG = {
  showTimestamp: true,
  theme: {
    symbols: {
      info: "💠",
      success: "✅",
      warning: "⚠️",
      error: "❌",
      debug: "🔧",
      trace: "📍",
      tree: {
        branch: "╠═▶",
        last: "╚═▶",
        vertical: "║   ",
        space: "    ",
      },
    },
    gradients: {
      info: ["#3a8dde", "#00d4ff"],
      success: ["#56ab2f", "#a8e063"],
      warning: ["#f7971e", "#ffd200"],
      error: ["#e52d27", "#b31217"],
      debug: ["#6a11cb", "#2575fc"],
      trace: ["#56ccf2", "#2f80ed"],
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
  boxenOptions: {
    padding: 0,
    margin: 0,
    borderStyle: "round",
    borderColor: "cyan",
    dimBorder: false,
    backgroundColor: "#000011",
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
        ...(config.theme || {}),
        symbols: {
          ...DEFAULT_CONFIG.theme.symbols,
          ...(config.theme?.symbols || {}),
          tree: {
            ...DEFAULT_CONFIG.theme.symbols.tree,
            ...(config.theme?.symbols?.tree || {}),
          },
        },
      },
      boxenOptions: {
        ...DEFAULT_CONFIG.boxenOptions,
        ...(config.boxenOptions || {}),
      },
    };
    BotConsole._instance = this;
  }

  _getGradient(type) {
    return gradient(
      this.config.theme.gradients[type] || DEFAULT_CONFIG.theme.gradients.info
    );
  }

  _timestamp() {
    if (!this.config.showTimestamp) return "";
    const now = new Date();
    const pad = (n, z = 2) => n.toString().padStart(z, "0");
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}.${pad(now.getMilliseconds(), 3)}`;
    return chalk.dim(`[${timeStr}]`);
  }

  _getStyle(type) {
    return this.config.theme.styles[type] || DEFAULT_CONFIG.theme.styles.info;
  }

  _getSymbol(type) {
    const style = this._getStyle(type);
    return (
      this.config.theme.symbols[style.symbol] ||
      DEFAULT_CONFIG.theme.symbols.info
    );
  }

  _centerText(text) {
    const width = 60;
    const len = stripAnsi(text).length;
    if (len >= width) return text;
    const left = Math.floor((width - len) / 2);
    return " ".repeat(left) + text;
  }

  formatHeader(text) {
    const width = 60;
    const gradBorder = gradient(["#6a11cb", "#2575fc"]);
    const gradText = gradient(["#f7971e", "#ffd200"]);

    const line = gradBorder("═".repeat(width - 4));
    const paddedText = this._centerText(`   ${text.toUpperCase()}   `);

    return [
      "",
      gradBorder(`╔${"═".repeat(width - 2)}╗`),
      gradBorder(`║`) + paddedText + gradBorder(`║`),
      gradBorder(`╠${line}╣`),
      gradText(this._centerText("✨ BOT CONSOLE LOGGING ✨")),
      gradBorder(`╚${"═".repeat(width - 2)}╝`),
      "",
    ].join("\n");
  }

  // Modificato per accettare un array di parti di messaggio già stringhe/primitive
  formatMessage(type, messageParts = []) {
    const gradColors =
      this.config.theme.gradients[type] || DEFAULT_CONFIG.theme.gradients.info;
    const grad = gradient(gradColors);
    const style = this._getStyle(type);
    const ts = this._timestamp();
    const label = chalk.bold(
      gradient(gradColors)(` ${this._getSymbol(type)}  ${style.label} `)
    );

    const contentJoined = messageParts.join(" ");
    const contentForBox = grad(contentJoined);

    const boxOptions = {
      ...this.config.boxenOptions,
      borderColor: gradColors[0],
      width: 115,
      padding: this.config.boxenOptions.padding,
      margin: this.config.boxenOptions.margin,
    };

    const box = boxen(contentForBox, boxOptions);

    return `${ts} ${label}\n${box}`;
  }

  formatValue(value, type) {
    const grad = this._getGradient(type);

    if (value == null) return chalk.gray.italic(`✗ ${value}`);
    if (typeof value === "string") return grad(`"${value}"`);
    if (typeof value === "number") return grad(`❪${value}❫`);
    if (typeof value === "boolean") return grad(`⟦${value}⟧`);
    if (typeof value === "function")
      return grad(`⚡ fn:${value.name || "anon"}`);
    if (typeof value === "symbol") return grad(`☯ ${value.toString()}`);
    if (typeof value === "bigint") return grad(`💠 ${value}n`);
    if (value instanceof Date) return grad(`📅 ${value.toISOString()}`);
    if (value instanceof RegExp) return grad(`🌀 ${value.toString()}`);
    if (value instanceof Error) return grad(`🔥 Error: ${value.message}`);

    if (Array.isArray(value)) {
      const preview = value
        .slice(0, 3)
        .map((v) => this.formatValue(v, type))
        .join(grad(", "));
      return grad(
        `[${value.length}]⟦${preview}${value.length > 3 ? grad("…") : ""}⟧`
      );
    }

    if (value instanceof Map) {
      return grad(`Map{${value.size}}`);
    }

    if (value instanceof Set) {
      return grad(`Set{${value.size}}`);
    }

    const keys = Object.keys(value);
    if (keys.length === 0) return grad("{}");
    const preview = keys
      .slice(0, 2)
      .map((k) => `${grad(k)}: ${this.formatValue(value[k], type)}`)
      .join(grad(", "));
    return grad(
      `{${keys.length}}⚋{${preview}${keys.length > 2 ? grad("…") : ""}}`
    );
  }

  // La tua formatTree originale
  formatTree(obj, type, prefix = "") {
    const { branch, last, vertical, space } = this.config.theme.symbols.tree;
    const grad = this._getGradient(type);

    const isPrimitive = (val) =>
      val === null ||
      val === undefined ||
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean" ||
      typeof val === "bigint" ||
      typeof val === "symbol";

    const formatKey = (key) =>
      /^[a-zA-Z0-9_$]+$/.test(key) ? key : `"${key}"`;

    if (isPrimitive(obj) || obj instanceof Date || obj instanceof Error) {
      return prefix + this.formatValue(obj, type);
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return prefix + grad("[]");
      return obj
        .map((val, i) => {
          const isLast = i === obj.length - 1;
          const symbol = isLast ? last : branch;
          const nextPrefix = prefix + (isLast ? space : vertical);
          return `${prefix}${grad(`${symbol} [${i}]`)}\n${this.formatTree(
            val,
            type,
            nextPrefix
          )}`;
        })
        .join("\n");
    }

    if (obj instanceof Map) {
      const entries = Array.from(obj.entries());
      if (entries.length === 0) return prefix + grad("Map{}");
      return entries
        .map(([k, v], idx) => {
          const isLast = idx === entries.length - 1;
          const symbol = isLast ? last : branch;
          const nextPrefix = prefix + (isLast ? space : vertical);
          return `${prefix}${grad(
            `${symbol} (key: ${this.formatValue(k, type)})`
          )}\n${this.formatTree(v, type, nextPrefix)}`;
        })
        .join("\n");
    }

    if (obj instanceof Set) {
      const values = Array.from(obj);
      if (values.length === 0) return prefix + grad("Set{}");
      return values
        .map((v, idx) => {
          const isLast = idx === values.length - 1;
          const symbol = isLast ? last : branch;
          const nextPrefix = prefix + (isLast ? space : vertical);
          return `${prefix}${grad(`${symbol} value`)}\n${this.formatTree(
            v,
            type,
            nextPrefix
          )}`;
        })
        .join("\n");
    }

    const entries = Object.entries(obj);
    if (entries.length === 0) return prefix + grad("{}");

    return entries
      .map(([key, val], idx) => {
        const isLast = idx === entries.length - 1;
        const symbol = isLast ? last : branch;
        const line = `${prefix}${grad(`${symbol} ${formatKey(key)}:`)}`;
        const nextPrefix = prefix + (isLast ? space : vertical);

        if (isPrimitive(val) || val instanceof Date || val instanceof Error) {
          return `${line} ${this.formatValue(val, type)}`;
        } else {
          return `${line}\n${this.formatTree(val, type, nextPrefix)}`;
        }
      })
      .join("\n");
  }

  write(type, ...args) {
    const mainMessageParts = [];
    const complexArgsToTree = [];

    for (const arg of args) {
      if (
        typeof arg === "string" ||
        typeof arg === "number" ||
        typeof arg === "boolean" ||
        arg === null ||
        arg === undefined
      ) {
        mainMessageParts.push(
          arg === null ? "null" : arg === undefined ? "undefined" : String(arg)
        );
      } else {
        complexArgsToTree.push(arg);
      }
    }

    console.log(this.formatMessage(type, mainMessageParts));

    if (complexArgsToTree.length > 0) {
      complexArgsToTree.forEach((obj) => {
        console.log(
          this.formatTree(obj, type, this.config.theme.symbols.tree.space)
        );
      });
    }
    console.log();
  }
}

function stripAnsi(str) {
  if (typeof str !== "string") return "";
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
}

["info", "success", "warning", "error", "debug", "trace"].forEach((level) => {
  BotConsole.prototype[level] = function (...args) {
    return this.write(level, ...args);
  };
});

export default new BotConsole();
