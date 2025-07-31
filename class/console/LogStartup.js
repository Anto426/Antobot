import os from "os";
import Table from "cli-table3";
import chalk from "chalk";
import gradient from "gradient-string";
import SystemCheck from "../client/SystemCheck.js";

const THEME = {
  info: gradient(["#00c6ff", "#0072ff"]),
  title: gradient(["#7928ca", "#ff0080"]),
};

const TABLE_OPTS = {
  style: { border: ["gray"], "padding-left": 1, "padding-right": 1 },
  chars: {
    top: "─",
    "top-mid": "┬",
    "top-left": "╭",
    "top-right": "╮",
    bottom: "─",
    "bottom-mid": "┴",
    "bottom-left": "╰",
    "bottom-right": "╯",
    left: "│",
    "left-mid": "├",
    right: "│",
    "right-mid": "┤",
    mid: "─",
    "mid-mid": "┼",
    middle: "│",
  },
};

class LogStartup {
  constructor() {
    this.termWidth = process.stdout.columns || 80;
    this.maxWidth = Math.min(this.termWidth - 2, 120);
  }

  mask(token = "") {
    if (!token) return chalk.red("Not Set");
    if (token.length <= 10) return token;
    return chalk.hex("#FFA500")(`${token.slice(0, 6)}…${token.slice(-4)}`);
  }

  gatherData() {
    const mem = process.memoryUsage();
    const cpus = os.cpus();

    return {
      bot: {
        Name: chalk.bold(SystemCheck.getName()),
        Version: SystemCheck.getVersion(),
        Author: SystemCheck.getAuthor(),
      },
      system: {
        Platform: os.platform(),
        Architecture: os.arch(),
        Release: os.release(),
        CPUs: `${cpus.length} × ${cpus[0].model}`,
      },
      resources: {
        "Heap Used": `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        "Heap Total": `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        Uptime: `${Math.floor(process.uptime())}s`,
      },
      process: {
        PID: process.pid,
        Node: process.version,
        "Exec Path": process.execPath,
      },
      tokens: {
        BOT: this.mask(process.env.TOKEN),
        GIT: this.mask(process.env.GITTOKEN),
      },
    };
  }

  centerText(text, width) {
    const len = stripAnsi(text).length;
    if (len >= width) return text;
    const left = Math.floor((width - len) / 2);
    const right = width - len - left;
    return " ".repeat(left) + text + " ".repeat(right);
  }

  createTableWithTitle(title, data) {
    const keys = Object.keys(data);
    const values = Object.values(data).map(String);

    const colKeyWidth = Math.floor(this.maxWidth * 0.3);
    const colValWidth = this.maxWidth - colKeyWidth - 3;

    const table = new Table({
      colWidths: [colKeyWidth, colValWidth],
      wordWrap: true,
      ...TABLE_OPTS,
    });

    const totalWidth = colKeyWidth + colValWidth + 3;
    const paddedTitle = this.centerText(title.toUpperCase(), totalWidth - 2);
    table.push([
      {
        colSpan: 2,
        content: THEME.title(paddedTitle),
        hAlign: "center",
      },
    ]);

    for (const [key, value] of Object.entries(data)) {
      table.push([THEME.info(key), chalk.whiteBright(value)]);
    }

    return table.toString();
  }

  printModules(title, modules, headers, color, mapRow) {
    if (!modules?.size) return;

    // Per ogni moduloTag crea una tabella con titolo
    const items = Array.from(modules.entries()).map(([k, m]) => ({ k, m }));

    // Raggruppa per moduleTag (o "Other")
    const grouped = {};
    for (const item of items) {
      const tag = item.m.moduleTag ?? item.m?.constructor?.moduleTag ?? "Other";
      if (!grouped[tag]) grouped[tag] = [];
      grouped[tag].push(item);
    }

    // Per ogni gruppo crea una tabella completa
    for (const [tag, group] of Object.entries(grouped)) {
      const colCount = headers.length;
      const colWidth = Math.floor((this.maxWidth - (colCount + 1)) / colCount);

      const table = new Table({
        head: headers.map((h) => color.bgBlack.bold(` ${h} `)),
        colWidths: Array(colCount).fill(colWidth),
        wordWrap: true,
        ...TABLE_OPTS,
      });

      // Riga titolo (moduleTag + count)
      const titleText = `${title} - Module Tag: ${tag} (${group.length})`;
      table.unshift([
        {
          colSpan: colCount,
          content: color.bold(this.centerText(titleText, this.maxWidth - 2)),
          hAlign: "center",
        },
      ]);

      for (const { k, m } of group) {
        const row = mapRow
          ? mapRow({ k, m })
          : headers.map((h) => {
              const lower = h.toLowerCase();

              if (lower === "name") return m.name ?? k;

              if (lower === "enabled") {
                const featureKey = (m.name ?? k).toLowerCase();
                const isEnabled = m.isActive ?? false;
                return isEnabled ? "✅ Yes" : "❌ No";
              }

              if (m[h] != null) return String(m[h]);

              if (m[lower] != null) return String(m[lower]);

              return "N/A";
            });

        table.push(row);
      }

      console.log(table.toString());
    }

    console.log(
      color.bold(
        this.centerText(`Total ${title}: ${modules.size}`, this.maxWidth)
      )
    );
    console.log();
  }

  async run() {
    const data = this.gatherData();

    console.log(this.createTableWithTitle("Bot Info", data.bot));
    console.log(this.createTableWithTitle("System Info", data.system));
    console.log(this.createTableWithTitle("Resources", data.resources));
    console.log(this.createTableWithTitle("Process Info", data.process));
    console.log(this.createTableWithTitle("Security Tokens", data.tokens));

    this.printModules(
      "Commands Loaded",
      client.commands,
      ["Name", "Enabled"],
      chalk.magenta
    );

    this.printModules(
      "Buttons Loaded",
      client.buttons,
      ["Name", "Enabled"],
      chalk.cyan
    );

    this.printModules(
      "Events Loaded",
      client.events,
      ["Name", "Enabled"],
      chalk.yellow
    );

    this.printModules(
      "Other Modules",
      client.other,
      ["Name", "Enabled", "Initialized"],
      chalk.blue,
      ({ k, m }) => {
        const name = m?.name ?? m?.constructor?.name ?? k;
        const key = name.toLowerCase();
        const enabled = SystemCheck.isFeatureEnabled(key);
        const initialized = !!(m?.instance ?? (typeof m === "object" && m));

        return [
          name,
          enabled ? "✅ Enabled" : "❌ Disabled",
          initialized ? "✅ Yes" : "❌ No",
        ];
      }
    );

    console.log(chalk.gray(`Log generated at: ${new Date().toLocaleString()}`));
  }
}

function stripAnsi(str) {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
}

export default new LogStartup();
