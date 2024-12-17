import SystemCheck from "../client/SystemCheck.js";
import Table from "cli-table3";
import chalk from "chalk";
import gradient from "gradient-string";

const TABLE_CHARS = {
  main: {
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
  section: {
    top: "─",
    "top-mid": "┬",
    "top-left": "┌",
    "top-right": "┐",
    bottom: "─",
    "bottom-mid": "┴",
    "bottom-left": "└",
    "bottom-right": "┘",
    left: "│",
    "left-mid": "├",
    right: "│",
    "right-mid": "┤",
    mid: "─",
    "mid-mid": "┼",
    middle: "│",
  },
};

const TABLE_STYLE = {
  head: ["cyan", "bold"],
  border: ["white"],
  compact: true,
  paddingLeft: 1,
  paddingRight: 1,
  alignment: "left",
  wordWrap: true,
};

const THEME_GRADIENTS = {
  info: ["#4facfe", "#00f2fe"],
  success: ["#67B26F", "#4ca2cd"],
  warning: ["#f6d365", "#fda085"],
  error: ["#ee0979", "#ff6a00"],
  debug: ["#764ba2", "#667eea"],
  trace: ["#74ebd5", "#9face6"],
  title: ["#800080", "#BA55D3"],
};

const gradients = Object.fromEntries(
  Object.entries(THEME_GRADIENTS).map(([key, colors]) => [
    key,
    gradient(colors),
  ])
);

class LogStartup {
  get data() {
    return {
      clientName: SystemCheck.getName(),
      version: SystemCheck.getVersion(),
      author: SystemCheck.getAuthor(),
      discordJsVersion: SystemCheck.getDependencies()?.["discord.js"] || "N/A",
      nodeJsVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      ramUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
        2
      )} MB`,
      totalRam: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(
        2
      )} MB`,
      uptime: `${Math.floor(process.uptime())}s`,
      token: this.maskToken(process.env.TOKEN),
      openAiToken: this.maskToken(process.env.OPENAITOKEN),
      gitToken: this.maskToken(process.env.GITTOKEN),
      inviteLink: client.generateInvite({ scopes: ["bot"] }),
      repoLink: SystemCheck.getRepo(),
      features: [
        {
          name: "Status System",
          enabled: SystemCheck.isFeatureEnabled("status"),
          details: "Server status monitoring",
        },
        {
          name: "Captcha System",
          enabled: SystemCheck.isFeatureEnabled("captcha"),
          details: "User verification system",
        },
        {
          name: "Holiday System",
          enabled: SystemCheck.isFeatureEnabled("holiday"),
          details: "Holiday events and notifications",
        },
        {
          name: "Music Module",
          enabled: SystemCheck.isFeatureEnabled("music"),
          details: "Music playback and controls",
        },
        {
          name: "OpenAI",
          enabled: SystemCheck.isFeatureEnabled("openai"),
          details: `Model: ${SystemCheck.getOpenAIModel() || "N/A"}`,
        },
      ],
    };
  }

  maskToken(token) {
    if (!token) return gradients.error("Not Set");
    return token.length > 10
      ? `${token.slice(0, 6)}•••${token.slice(-4)}`
      : "•".repeat(token.length);
  }

  createTable({ headers, chars = TABLE_CHARS.main, colWidths }) {
    return new Table({
      head: headers.map((h) => chalk.bold(gradients.info(h))),
      chars,
      style: { ...TABLE_STYLE, head: ["bold"], border: ["white"] },
      wordWrap: true,
      colWidths,
    });
  }

  logHeader(text) {
    const width = 80;
    const title = ` ${text.toUpperCase()} `;
    const padding = (width - title.length) / 2;

    console.log("\n" + gradients.title("╔" + "═".repeat(width) + "╗"));
    console.log(
      gradients.title("║") +
        " ".repeat(Math.floor(padding)) +
        chalk.bold(gradients.title(title)) +
        " ".repeat(Math.ceil(padding)) +
        gradients.title("║")
    );
    console.log(gradients.title("╠" + "═".repeat(width) + "╣"));
  }

  logFooter() {
    const width = 80;
    console.log(gradients.title("╚" + "═".repeat(width) + "╝"));
    console.log(
      chalk.gray(`\nLog generated at: ${new Date().toLocaleString()}`)
    );
  }

  logSectionSeparator() {
    const width = 80;
    console.log(gradients.title("╠" + "═".repeat(width) + "╣"));
  }

  logGeneralInfo() {
    const {
      clientName,
      version,
      author,
      discordJsVersion,
      nodeJsVersion,
      platform,
      arch,
      ramUsage,
      totalRam,
      uptime,
    } = this.data;

    this.logHeader("Bot Information");

    const mainTable = this.createTable({
      headers: ["Client Name", "Version", "Author"],
      colWidths: [30, 20, 30],
    });
    mainTable.push([
      gradients.success(clientName),
      gradients.warning(version),
      gradients.info(author),
    ]);

    const systemTable = this.createTable({
      headers: ["Discord.js", "Node.js", "Platform", "Architecture"],
      colWidths: [20, 20, 20, 20],
    });
    systemTable.push([
      gradients.debug(discordJsVersion),
      gradients.debug(nodeJsVersion),
      gradients.debug(platform),
      gradients.debug(arch),
    ]);

    const resourceTable = this.createTable({
      headers: ["Used RAM", "Total RAM", "Uptime"],
      colWidths: [27, 27, 26],
    });
    resourceTable.push([
      gradients.error(ramUsage),
      gradients.error(totalRam),
      gradients.warning(uptime),
    ]);

    console.log(mainTable.toString());
    console.log(systemTable.toString());
    console.log(resourceTable.toString());
  }

  logFeatures() {
    this.logHeader("Features Status");

    const featuresTable = this.createTable({
      headers: ["Feature", "Status", "Details"],
      chars: TABLE_CHARS.section,
      colWidths: [20, 15, 45],
    });

    this.data.features.forEach(({ name, enabled, details }) => {
      featuresTable.push([
        gradients.warning(name),
        enabled ? gradients.success("Enabled") : gradients.error("Disabled"),
        chalk.gray(details),
      ]);
    });

    console.log(featuresTable.toString());
  }

  logSecurity() {
    const { token, openAiToken, gitToken } = this.data;

    this.logHeader("Security Information");

    const securityTable = this.createTable({
      headers: ["Type", "Value"],
      chars: TABLE_CHARS.section,
      colWidths: [20, 60],
    });

    [
      ["Bot Token", token],
      ["OpenAI Token", openAiToken],
      ["Git Token", gitToken],
    ].forEach(([key, value]) => {
      securityTable.push([gradients.warning(key), chalk.gray(value)]);
    });

    console.log(securityTable.toString());
  }

  logModules() {
    this.logHeader("Loaded Modules");

    const modules = [
      {
        name: "Base Commands",
        collection: client.basecommands,
        columns: ["Command", "Category", "Description"],
        colWidths: [20, 20, 40],
      },
      {
        name: "Base Events",
        collection: client.baseevents,
        columns: ["name", "eventType", "allowevents"],
        colWidths: [40, 40],
      },
      {
        name: "Base Buttons",
        collection: client.basebutton,
        columns: ["Button", "Description"],
        colWidths: [30, 50],
      },
      {
        name: "Music Commands",
        collection: client.musiccommands,
        columns: ["Command", "Description"],
        colWidths: [20, 60],
      },
      {
        name: "Music Events",
        collection: client.musicevents,
        columns: ["name", "eventType", "allowevents"],
        colWidths: [40, 40],
      },
      {
        name: "Music Buttons",
        collection: client.musicbutton,
        columns: ["Button", "Description"],
        colWidths: [30, 50],
      },
    ];

    modules.forEach(({ name, collection, columns, colWidths }) => {
      if (collection?.size) {
        console.log(chalk.bold(gradients.title(`\n${name}:`)));
        const table = this.createTable({
          headers: columns,
          chars: TABLE_CHARS.section,
          colWidths,
        });
        collection.forEach((item) => {
          const row = columns.map((col) => {
            const value = item[col.toLowerCase()] || "N/A";
            return gradients.success(value);
          });
          table.push(row);
        });
        console.log(table.toString());
        console.log(chalk.gray(`Total ${name}: ${collection.size}`));
      }
    });
  }

  logGuilds() {
    if (client.guilds.cache.size > 0) {
      this.logHeader("Connected Servers");

      const guildsTable = this.createTable({
        headers: [
          "Server Name",
          "Members",
          "Owner",
          "Created At",
          "Region",
          "Boost Level",
          "ID",
        ],
        chars: TABLE_CHARS.section,
        colWidths: [25, 10, 20, 20, 10, 12, 20],
      });

      client.guilds.cache.forEach((guild) => {
        const owner =
          guild.members.cache.get(guild.ownerId)?.user.username || "Unknown";
        const createdAt = new Date(guild.createdTimestamp).toLocaleDateString();
        const boostLevel = `Level ${guild.premiumTier}`;

        guildsTable.push([
          gradients.success(guild.name),
          gradients.info(`${guild.memberCount}`),
          gradients.warning(owner),
          gradients.debug(createdAt),
          gradients.trace(guild.preferredLocale),
          gradients.error(boostLevel),
          chalk.gray(guild.id),
        ]);
      });

      console.log(guildsTable.toString());
      console.log(chalk.gray(`Total Servers: ${client.guilds.cache.size}`));
    }
  }

  log() {
    this.logGeneralInfo();
    this.logSectionSeparator();
    this.logFeatures();
    this.logSectionSeparator();
    this.logSecurity();
    this.logSectionSeparator();
    this.logModules();
    this.logSectionSeparator();
    this.logGuilds();
    this.logFooter();
  }
}

export default LogStartup;
