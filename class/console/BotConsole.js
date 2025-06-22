import chalk from "chalk";
import gradient from "gradient-string";
import boxen from "boxen";
// Assumiamo che util sia disponibile o importato se si vuole usare util.inspect per oggetti molto complessi
// import util from "util";

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
        vertical: "║   ", // Spazio leggermente aumentato per un possibile miglior allineamento
        space: "    ", // Spazio leggermente aumentato
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
    borderColor: "cyan", // Default, ma verrà sovrascritto in formatMessage
    dimBorder: false,
    backgroundColor: "#000011",
    // width: 115, // Manteniamo questo se era nelle tue intenzioni
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
        ...(config.theme || {}), // Assicura che config.theme esista
        symbols: {
          // Unisci symbols specificamente se necessario
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
      this.config.theme.gradients[type] || DEFAULT_CONFIG.theme.gradients.info // Fallback a info
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
    // La tua implementazione originale
    const width = 60;
    const len = stripAnsi(text).length;
    if (len >= width) return text;
    const left = Math.floor((width - len) / 2);
    return " ".repeat(left) + text;
  }

  formatHeader(text) {
    // La tua implementazione originale
    const width = 60;
    const gradBorder = gradient(["#6a11cb", "#2575fc"]);
    const gradText = gradient(["#f7971e", "#ffd200"]);

    const line = gradBorder("═".repeat(width - 4));
    const paddedText = this._centerText(`   ${text.toUpperCase()}   `); // Corretto lo spazio extra

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
    const grad = gradient(gradColors); // Il gradiente per il contenuto del box
    const style = this._getStyle(type);
    const ts = this._timestamp();
    const label = chalk.bold(
      gradient(gradColors)(` ${this._getSymbol(type)}  ${style.label} `) // Applica gradiente anche al label
    );

    // Unisci le parti del messaggio in una singola stringa.
    // Applica il gradiente all'intera stringa risultante per il box.
    const contentJoined = messageParts.join(" ");
    const contentForBox = grad(contentJoined); // Applica gradiente qui

    const boxOptions = {
      ...this.config.boxenOptions,
      borderColor: gradColors[0], // Usa il primo colore del gradiente del tipo di messaggio
      width: 115, // Manteniamo la larghezza fissa originale
      padding: this.config.boxenOptions.padding, // Usa il padding dalla config (originale era 0)
      margin: this.config.boxenOptions.margin, // Usa il margin dalla config (originale era 0)
    };

    const box = boxen(contentForBox, boxOptions);

    return `${ts} ${label}\n${box}`;
  }

  // La tua formatValue originale
  formatValue(value, type) {
    const grad = this._getGradient(type);
    if (value == null) return chalk.gray.italic(`✗ ${value}`); // Gestisce sia null che undefined qui
    if (Array.isArray(value)) {
      const preview = value
        .slice(0, 3)
        .map((v) => this.formatValue(v, type))
        .join(grad(", ")); // Formatta anche i valori interni
      return grad(
        `[${value.length}]⟦${preview}${value.length > 3 ? grad("…") : ""}⟧`
      );
    }
    if (value instanceof Date) return grad(`📅 ${value.toISOString()}`);
    if (value instanceof Error) {
      // Mostra lo stack se l'errore lo ha e la profondità lo permette (concetto non implementato qui)
      // Per ora, solo il messaggio.
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
        // Per oggetti semplici passati a formatValue (es. foglie di formatTree)
        const keys = Object.keys(value);
        if (keys.length === 0) return grad("{}");
        const preview = keys
          .slice(0, 2) // Leggermente meno verboso per le foglie
          .map((k) => `${grad(k)}:${this.formatValue(value[k], type)}`)
          .join(grad(", "));
        return grad(
          `{${keys.length}}⚋{${preview}${keys.length > 2 ? grad("…") : ""}}`
        );
      }
      default:
        return grad(String(value));
    }
  }

  // La tua formatTree originale
  formatTree(obj, type, prefix = "") {
    const { branch, last, vertical, space } = this.config.theme.symbols.tree;
    const grad = this._getGradient(type);

    // Se obj è un errore, formatValue lo gestisce bene come stringa singola (o con stack)
    if (
      obj instanceof Error ||
      obj instanceof Date ||
      !obj ||
      typeof obj !== "object" ||
      Array.isArray(obj)
    ) {
      // Se è un array, formatValue lo gestirà con anteprima.
      // Se vogliamo un albero per array, dobbiamo modificare qui.
      // Per ora, usiamo formatValue per non-oggetti o tipi speciali.
      return prefix + this.formatValue(obj, type);
    }

    const entries = Object.entries(obj);
    if (entries.length === 0) {
      return prefix + grad(Array.isArray(obj) ? "[]" : "{}");
    }

    return entries
      .map(([key, val], idx, arr) => {
        const isLast = idx === arr.length - 1;
        const symbol = isLast ? last : branch;
        const line = prefix + grad(`${symbol} ${key}: `);
        const nextPrefix = prefix + (isLast ? space : vertical);

        // Se val è un oggetto (e non null, né Date, né Error) O un array, continua la ricorsione
        if (
          val &&
          typeof val === "object" &&
          !(val instanceof Date) &&
          !(val instanceof Error)
        ) {
          return `${line}\n${this.formatTree(val, type, nextPrefix)}`;
        }
        return line + this.formatValue(val, type);
      })
      .join("\n");
  }

  /**
   * Metodo write modificato per gestire "n parametri".
   * Le stringhe e i primitivi vengono uniti per il messaggio principale nel box.
   * Gli oggetti, Errori, Date vengono stampati dopo, usando formatTree.
   */
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
        // Oggetti, Array, Errori, Date verranno gestiti da formatTree
        complexArgsToTree.push(arg);
      }
    }

    // Stampa il messaggio principale (stringhe/primitivi) dentro il box
    console.log(this.formatMessage(type, mainMessageParts));

    // Stampa ogni argomento complesso usando formatTree
    if (complexArgsToTree.length > 0) {
      complexArgsToTree.forEach((obj) => {
        // Non aggiungo un'intestazione extra qui, lascio che formatTree produca la sua struttura
        console.log(
          this.formatTree(obj, type, this.config.theme.symbols.tree.space)
        ); // Inizia l'albero con un indent
      });
    }
    console.log(); // Riga vuota finale per spaziatura
  }
}

function stripAnsi(str) {
  // La tua funzione originale
  if (typeof str !== "string") return ""; // Aggiunto controllo per robustezza
  return str.replace(
    // eslint-disable-next-line no-control-regex
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
