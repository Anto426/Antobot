import Table from "cli-table3";
import chalk from "chalk";
import gradient from "gradient-string";
import SystemCheck from "../client/SystemCheck.js";

const THEME = {
  info: gradient(["#4facfe", "#00f2fe"]),
  success: gradient(["#67B26F", "#4ca2cd"]),
  warning: gradient(["#f6d365", "#fda085"]),
  error: gradient(["#ee0979", "#ff6a00"]),
  debug: gradient(["#764ba2", "#667eea"]),
  trace: gradient(["#74ebd5", "#9face6"]),
  title: gradient(["#800080", "#BA55D3"]),
};

const TABLE_OPTIONS = {
  style: {
    border: ["gray"],
    compact: false,
    "padding-left": 1,
    "padding-right": 1,
    head: [],
  },
  chars: {
    top: "═",
    "top-mid": "╤",
    "top-left": "╔",
    "top-right": "╗",
    bottom: "═",
    "bottom-mid": "╧",
    "bottom-left": "╚",
    "bottom-right": "╝",
    left: "║",
    "left-mid": "╟",
    right: "║",
    "right-mid": "╢",
    mid: "─",
    "mid-mid": "┼",
    middle: "│",
  },
};

class LogStartup {
  maskToken(token) {
    return token
      ? `${token.slice(0, 6)}…${token.slice(-4)}`
      : chalk.red("Not Set");
  }

  async gatherData() {
    const sys = SystemCheck;
    const mem = process.memoryUsage();
    let invite = "N/A";
    if (client.generateInvite) {
      try {
        invite = await client.generateInvite({ scopes: ["bot"] });
      } catch {
        invite = "N/A";
      }
    }

    return {
      clientName: sys.getName(),
      version: sys.getVersion(),
      author: sys.getAuthor(),
      discordJs: sys.getDependencies()?.["discord.js"] ?? "N/A",
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      ramUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      ramTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      uptime: `${Math.floor(process.uptime())}s`,
      tokens: {
        bot: this.maskToken(process.env.TOKEN),
        openai: this.maskToken(process.env.OPENAITOKEN),
        git: this.maskToken(process.env.GITTOKEN),
      },
      invite,
      repo: sys.getRepo(),
      features: sys.getFeatures(),
    };
  }

  printHeader(title) {
    const width = 80;
    const line = "═".repeat(width);
    const label = ` ${title.toUpperCase()} `;
    const pad = Math.floor((width - label.length) / 2);
    console.log("\n" + THEME.title(`╔${line}╗`));
    console.log(
      THEME.title("║") +
        " ".repeat(pad) +
        chalk.bold(label) +
        " ".repeat(pad) +
        THEME.title("║")
    );
    console.log(THEME.title(`╠${line}╣`));
  }

  printFooter() {
    const line = "═".repeat(80);
    console.log(THEME.title(`╚${line}╝`));
    console.log(chalk.gray(`Log generated at: ${new Date().toLocaleString()}`));
  }

  printTable(title, rows, colWidths = []) {
    if (!rows.length) return;
    this.printHeader(title);

    const headers = Object.keys(rows[0]);
    const table = new Table({
      head: headers.map((h) => chalk.bgCyan.black.bold(` ${h} `)),
      colWidths,
      ...TABLE_OPTIONS,
    });

    for (const row of rows) {
      table.push(headers.map((h) => row[h] ?? "N/A"));
    }

    console.log(table.toString());
  }

  async run() {
    const d = await this.gatherData();

    this.printTable(
      "Bot Info",
      [
        {
          Client: THEME.success(d.clientName),
          Version: THEME.warning(d.version),
          Author: THEME.info(d.author),
        },
      ],
      [30, 20, 30]
    );

    this.printTable(
      "System",
      [
        {
          "Discord.js": THEME.debug(d.discordJs),
          "Node.js": THEME.debug(d.node),
          Platform: THEME.debug(d.platform),
          Arch: THEME.debug(d.arch),
        },
      ],
      [20, 20, 20, 20]
    );

    this.printTable(
      "Resources",
      [
        {
          "RAM Used": THEME.error(d.ramUsed),
          "RAM Total": THEME.error(d.ramTotal),
          Uptime: THEME.warning(d.uptime),
        },
      ],
      [25, 25, 30]
    );

    this.printTable(
      "Features",
      d.features.map((f) => ({
        Feature: f.name,
        Status: f.enabled
          ? chalk.green("✅ Enabled")
          : chalk.red("❌ Disabled"),
      })),
      [40, 40]
    );

    this.printTable(
      "Security",
      [
        { Type: "Bot Token", Value: chalk.gray(d.tokens.bot) },
        { Type: "OpenAI Token", Value: chalk.gray(d.tokens.openai) },
        { Type: "Git Token", Value: chalk.gray(d.tokens.git) },
      ],
      [20, 60]
    );

    this.printFooter();
  }
}

export default new LogStartup();
