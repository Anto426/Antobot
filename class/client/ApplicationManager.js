import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import readline from "readline";
import consoleInstance from "../console/Console.js";
import systemcheck from "./SystemCheck.js";
import clientInitializer from "./ClientInitializer.js";
import { ERROR_CODE } from "../error/ErrorHandler.js";

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
      return await new Promise((resolve) => {
        rl.question("Enter your token: ", resolve);
      });
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

  async initializeClients() {
    try {
      await systemcheck.loadConfig();
      const hasMusic = systemcheck.isFeatureEnabled("music");
      const hasAI = systemcheck.isFeatureEnabled("openai");

      if (hasMusic && hasAI) {
        consoleInstance.log(
          "Initializing all clients for music and AI features"
        );
        await clientInitializer.initialize();
        return true;
      } else {
        await clientInitializer.initializeClientBase();
        if (hasMusic) {
          consoleInstance.log("Initializing music client");
          await clientInitializer.initializeClientDistube();
          return true;
        } else if (hasAI) {
          consoleInstance.log("Initializing AI client");
          await clientInitializer.initializeClientAI();
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}

export default ApplicationManager;
