import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import readline from "readline";
import BotConsole from "../console/BotConsole.js";
import clientInitializer from "./ClientInitializer.js";
import { ERROR_CODE } from "./../error/ErrorHandler.js";
import SystemCheck from "./SystemCheck.js";
import loadModules from "./../Module/LoadModules.js";

class ApplicationManager {
  async getToken(argv) {
    let token = process.env.TOKEN;

    if (argv.asktoken || !token) {
      token = await this.getGithubConfig("repo_url");
      process.env.TOKEN = token;
    }

    if (!token) {
      throw ERROR_CODE.applicationManager.token;
    }

    return token;
  }

  async promptForToken() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      const token = await new Promise((resolve) => {
        rl.question("Enter your token: ", resolve);
      });
      process.env.TOKEN = token;
      return token;
    } finally {
      rl.close();
    }
  }

  configureYargs() {
    return yargs(hideBin(process.argv))
      .option("asktoken", {
        alias: "t",
        type: "boolean",
        description: "Ask for token input",
      })
      .help()
      .alias("help", "h")
      .version()
      .alias("version", "v")
      .showHelpOnFail(true);
  }

  async initializeAPP() {
    try {
      await SystemCheck.initialize();
      const hasMusic = SystemCheck.isFeatureEnabled("music");
      const hasAI = SystemCheck.isFeatureEnabled("openai");

      if (hasMusic && hasAI) {
        BotConsole.info("Initializing all clients for music and AI features");
        await clientInitializer.initialize();
      } else {
        await clientInitializer.initializeClientBase();
        if (hasMusic) {
          await clientInitializer.initializeClientDistube();
        } else if (hasAI) {
          await clientInitializer.initializeClientAI();
        }
      }

      await loadModules.initialize();

      BotConsole.success("All modules loaded successfully");

      client.login(process.env.TOKEN);
    } catch (error) {
      throw error;
    }
  }
}

export default ApplicationManager;
