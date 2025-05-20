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
        vertical: "║  ",
        space: "   ",
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
        ...config.theme,
      },
      boxenOptions: {
        ...DEFAULT_CONFIG.boxenOptions,
        ...config.boxenOptions,
      },
    };
    BotConsole._instance = this;
  }

  _getGradient(type) {
    return gradient(
      this.config.theme.gradients[type] ||
      DEFAULT_CONFIG.theme.gradients[type]
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
    return (
      this.config.theme.styles[type] || DEFAULT_CONFIG.theme.styles[type]
    );
  }

  _getSymbol(type) {
    const style = this._getStyle(type);
    return this.config.theme.symbols[style.symbol];
  }

  _centerText(text) {
    const width = 60; // width for header centering (più compatto)
    const len = stripAnsi(text).length;
    if (len >= width) return text;
    const left = Math.floor((width - len) / 2);
    return " ".repeat(left) + text;
  }

  formatHeader(text) {
    const width = 60; // più stretto
    const gradBorder = gradient(["#6a11cb", "#2575fc"]);
    const gradText = gradient(["#f7971e", "#ffd200"]);

    const line = gradBorder("═".repeat(width - 4));
    const paddedText = this._centerText(`  ${text.toUpperCase()}  `);

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

formatMessage(type, parts) {
  const gradColors =
    this.config.theme.gradients[type] || DEFAULT_CONFIG.theme.gradients[type];
  const grad = gradient(gradColors);
  const style = this._getStyle(type);
  const ts = this._timestamp();
  const label = chalk.bold(grad(` ${this._getSymbol(type)}  ${style.label} `));

  const contentRaw = parts.join(" ");
  const contentColored = grad(contentRaw);

  const box = boxen(contentColored, {
    ...this.config.boxenOptions,
    borderColor: gradColors[0], 
    width: 70,                  
    padding: 0,         
    margin: 0,               
  });


  return `${ts} ${label}\n${box}`;
}

  formatValue(value, type) {
    const grad = this._getGradient(type);
    if (value == null) return chalk.gray.italic(`✗ ${value}`);
    if (Array.isArray(value)) {
      const preview = value.slice(0, 3).join(", ");
      return grad(
        `[${value.length}]⟦${preview}${value.length > 3 ? "…" : ""}⟧`
      );
    }
    if (value instanceof Date) return grad(`📅 ${value.toISOString()}`);
    if (value instanceof Error) return grad(`🔥 Error: ${value.message}`);

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

  write(type, ...args) {
    const messages = args.filter((a) => typeof a !== "object");
    const objects = args.filter((a) => a && typeof a === "object");

    console.log(this.formatMessage(type, messages));
    objects.forEach((obj) => console.log(this.formatTree(obj, type)));

    console.log();
  }

  section(title) {
    console.log(this.formatHeader(title));
  }
}

function stripAnsi(str) {
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
