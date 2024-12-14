import SystemCheck from "../client/SystemCheck.js";
import Table from "cli-table3";
import chalk from "chalk";

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
    "top-left": "├",
    "top-right": "┤",
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
  head: ["cyan"],
  border: ["white"],
  compact: true,
};

class LogStartup {
  constructor() {
    this.data = {
      // Basic Info
      clientName: SystemCheck.getName(),
      version: SystemCheck.getVersion(),
      author: SystemCheck.getAuthor(),

      // System Info
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
      uptime: process.uptime(),

      // Security Tokens
      token: this.maskToken(process.env.TOKEN),
      openAiToken: this.maskToken(process.env.OPENAITOKEN),
      gitToken: this.maskToken(process.env.GITTOKEN),

      // Links
      inviteLink: client.generateInvite({ scopes: ["bot"] }),
      repoLink: SystemCheck.getRepo(),

      // Features
      musicEnabled: SystemCheck.isFeatureEnabled("music"),
      aiEnabled: SystemCheck.isFeatureEnabled("ai"),
      gptEnabled: SystemCheck.isFeatureEnabled("gpt"),
    };
  }

  maskToken(token) {
    return token ? `${token.slice(0, 6)}...${token.slice(-4)}` : "Not Set";
  }

  createTable(headers, chars = TABLE_CHARS.main, options = {}) {
    return new Table({
      head: headers.map((h) => chalk.bold.cyan(h)),
      chars,
      style: TABLE_STYLE,
      ...options,
    });
  }

  logHeader(text) {
    console.log(chalk.bold.cyan("\n" + "═".repeat(50)));
    console.log(chalk.bold.white(` ${text.toUpperCase()} `));
    console.log(chalk.bold.cyan("═".repeat(50)));
  }

  logGeneralInfo() {
    this.logHeader("Bot Information");

    const mainTable = this.createTable(
      ["Client Name", "Version", "Author"],
      TABLE_CHARS.main,
      { colWidths: [30, 20, 30] }
    );
    mainTable.push([
      chalk.green(this.data.clientName),
      chalk.yellow(this.data.version),
      chalk.blue(this.data.author),
    ]);

    const systemTable = this.createTable(
      ["Discord.js", "Node.js", "Platform", "Architecture"],
      TABLE_CHARS.main,
      { colWidths: [20, 20, 20, 20] }
    );
    systemTable.push([
      chalk.magenta(this.data.discordJsVersion),
      chalk.magenta(this.data.nodeJsVersion),
      chalk.magenta(this.data.platform),
      chalk.magenta(this.data.arch),
    ]);

    const resourceTable = this.createTable(
      ["Used RAM", "Total RAM", "Uptime"],
      TABLE_CHARS.main,
      { colWidths: [27, 27, 26] }
    );
    resourceTable.push([
      chalk.red(this.data.ramUsage),
      chalk.red(this.data.totalRam),
      chalk.yellow(`${Math.floor(this.data.uptime)}s`),
    ]);

    console.log(mainTable.toString());
    console.log(systemTable.toString());
    console.log(resourceTable.toString());
  }

  logFeatures() {
    this.logHeader("Features Status");
    const featuresTable = this.createTable(
      ["Feature", "Status", "Details"],
      TABLE_CHARS.section,
      { colWidths: [20, 15, 45] }
    );

    const features = [
      [
        "Status System",
        SystemCheck.isFeatureEnabled("status"),
        "Server status monitoring",
      ],
      [
        "Captcha System",
        SystemCheck.isFeatureEnabled("captcha"),
        "User verification system",
      ],
      [
        "Holiday System",
        SystemCheck.isFeatureEnabled("holiday"),
        "Holiday events and notifications",
      ],
      [
        "Music Module",
        SystemCheck.isFeatureEnabled("music"),
        "Music playback and controls",
      ],
      [
        "OpenAI",
        SystemCheck.isFeatureEnabled("openai"),
        `Model: ${SystemCheck.getOpenAIModel() || "N/A"}`,
      ],
    ];

    features.forEach(([feature, enabled, details]) => {
      featuresTable.push([
        chalk.yellow(feature),
        enabled ? chalk.green("Enabled") : chalk.red("Disabled"),
        chalk.gray(details),
      ]);
    });

    console.log(featuresTable.toString());
  }

  logSecurity() {
    this.logHeader("Security Information");
    const securityTable = this.createTable(
      ["Type", "Value"],
      TABLE_CHARS.section,
      { colWidths: [20, 60] }
    );

    [
      ["Bot Token", this.data.token],
      ["OpenAI Token", this.data.openAiToken],
      ["Git Token", this.data.gitToken],
    ].forEach(([key, value]) => {
      securityTable.push([chalk.yellow(key), chalk.gray(value)]);
    });

    console.log(securityTable.toString());
  }

  logModules() {
    this.logHeader("Loaded Modules");

    // Log Base Commands
    if (client.basecommands?.size > 0) {
      console.log(chalk.bold.white("\nBase Commands:"));
      const commandsTable = this.createTable(
        ["Command", "Category", "Description", "Cooldown", "Permissions"],
        TABLE_CHARS.section,
        { colWidths: [15, 15, 30, 10, 20] }
      );
      client.basecommands.forEach((cmd) => {
        commandsTable.push([
          chalk.green(cmd.name),
          chalk.blue(cmd.category || "N/A"),
          chalk.white(cmd.data.description),
        ]);
      });
      console.log(commandsTable.toString());
      console.log(
        chalk.gray(`Total Base Command: ${client.basecommands.size}`)
      );
    }

    // Log Base Events
    if (client.baseevents?.size > 0) {
      console.log(chalk.bold.white("\nBase Events:"));
      const eventsTable = this.createTable(
        ["Event", "Type"],
        TABLE_CHARS.section,
        { colWidths: [40, 40] }
      );
      client.baseevents.forEach((event) => {
        eventsTable.push([
          chalk.yellow(event.name),
          chalk.blue(event.eventType),
        ]);
      });
      console.log(eventsTable.toString());
      console.log(chalk.gray(`Total Base Event: ${client.baseevents.size}`));
    }

    // Log Base Buttons
    if (client.basebutton?.size > 0) {
      console.log(chalk.bold.white("\nBase Buttons:"));
      const buttonsTable = this.createTable(
        ["Button", "Description"],
        TABLE_CHARS.section,
        { colWidths: [30, 50] }
      );
      client.basebutton.forEach((btn) => {
        buttonsTable.push([
          chalk.magenta(btn.customId),
          chalk.white(btn.description || "N/A"),
        ]);
      });
      console.log(buttonsTable.toString());
      console.log(chalk.gray(`Total Base Button: ${client.basebutton.size}`));
    }

    // Log Music Commands
    if (client.musiccommands?.size > 0) {
      console.log(chalk.bold.white("\nMusic Commands:"));
      const musicTable = this.createTable(
        ["Command", "Description"],
        TABLE_CHARS.section,
        { colWidths: [20, 60] }
      );
      client.musiccommands.forEach((cmd) => {
        musicTable.push([
          chalk.green(cmd.name),
          chalk.white(cmd.data.description),
        ]);
      });
      console.log(musicTable.toString());
      console.log(
        chalk.gray(`Total Distube Command: ${client.musiccommands.size}`)
      );
    }

    // Log Music Events
    if (client.musicevents?.size > 0) {
      console.log(chalk.bold.white("\nMusic Events:"));
      const musicEventsTable = this.createTable(
        ["Event", "Type"],
        TABLE_CHARS.section,
        { colWidths: [40, 40] }
      );
      client.musicevents.forEach((event) => {
        musicEventsTable.push([
          chalk.yellow(event.name),
          chalk.blue(event.eventType),
        ]);
      });
      console.log(musicEventsTable.toString());
      console.log(
        chalk.gray(`Total Distube Event: ${client.musicevents.size}`)
      );
    }

    // Log Music Buttons
    if (client.musicbutton?.size > 0) {
      console.log(chalk.bold.white("\nMusic Buttons:"));
      const musicButtonsTable = this.createTable(
        ["Button", "Description"],
        TABLE_CHARS.section,
        { colWidths: [30, 50] }
      );
      client.musicbutton.forEach((btn) => {
        musicButtonsTable.push([
          chalk.magenta(btn.customId),
          chalk.white(btn.description || "N/A"),
        ]);
      });
      console.log(musicButtonsTable.toString());
      console.log(
        chalk.gray(`Total Distube Button: ${client.musicbutton.size}`)
      );
    }
  }

  logGuilds() {
    if (client.guilds.cache.size > 0) {
      this.logHeader("Connected Servers");

      const guildsTable = this.createTable(
        [
          "Server Name",
          "Members",
          "Owner",
          "Created At",
          "Region",
          "Boost Level",
          "ID",
        ],
        TABLE_CHARS.section,
        { colWidths: [25, 10, 20, 20, 10, 12, 20] }
      );

      client.guilds.cache.forEach((guild) => {
        const owner =
          guild.members.cache.get(guild.ownerId)?.user.username || "Unknown";
        const createdAt = new Date(guild.createdTimestamp).toLocaleDateString();
        const boostLevel = `Level ${guild.premiumTier}`;

        guildsTable.push([
          chalk.green(guild.name),
          chalk.blue(guild.memberCount.toString()),
          chalk.yellow(owner),
          chalk.magenta(createdAt),
          chalk.cyan(guild.preferredLocale),
          chalk.red(boostLevel),
          chalk.gray(guild.id),
        ]);
      });

      console.log(guildsTable.toString());
      console.log(chalk.gray(`Total Servers: ${client.guilds.cache.size}`));
    }
  }

  log() {
    try {
      console.log(chalk.bold.cyan("╔" + "═".repeat(78) + "╗"));
      console.log(
        chalk.bold.cyan(
          "║" +
            chalk.bold.white(` BOT STARTUP LOG `.padStart(40 + 7).padEnd(78)) +
            "║"
        )
      );
      console.log(chalk.bold.cyan("╚" + "═".repeat(78) + "╝\n"));

      this.logGeneralInfo();
      this.logFeatures();
      this.logSecurity();
      this.logModules();
      this.logGuilds();

      console.log(chalk.bold.cyan("\n" + "═".repeat(80)));
    } catch (error) {
      console.error(chalk.red("Error in startup logging:", error));
    }
  }
}

export default LogStartup;
