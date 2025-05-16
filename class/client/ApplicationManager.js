import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import readline from "readline";
import BotConsole from "../console/BotConsole.js";
import clientInitializer from "./ClientInitializer.js";
import SystemCheck from "./SystemCheck.js";
import loadModules from "./../Loader/LoadModules.js";

class ApplicationManager {
  constructor() {
    this.argv = this.configureYargs().argv;
  }

  async getToken() {
    try {
      let token = process.env.TOKEN;

      if (this.argv.asktoken || !token) {
        token = await this.promptForToken();
      }

      if (!token) {
        throw new Error("Token is missing");
      }

      return token;
    } catch (error) {
      BotConsole.error("Failed to get token:", error.message);
      throw error;
    }
  }

  async promptForToken() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      const token = await new Promise((resolve, reject) => {
        BotConsole.info("Please provide your Discord bot token");
        rl.question("Token: ", (input) => {
          const trimmedInput = input.trim();
          if (!trimmedInput) {
            reject(new Error("Token appears to be invalid (empty)"));
          } else if (trimmedInput.length < 50) {
            reject(new Error("Token appears to be invalid (too short)"));
          } else {
            resolve(trimmedInput);
          }
        });
      });

      process.env.TOKEN = token;
      BotConsole.success("Token successfully stored");
      return token;
    } catch (error) {
      throw new Error("Failed to get token", error);
    } finally {
      rl.close();
    }
  }

  configureYargs() {
    return yargs(hideBin(process.argv))
      .option("asktoken", {
        alias: "t",
        type: "boolean",
        description: "Request token input",
      })
      .help()
      .alias("help", "h")
      .version()
      .alias("version", "v")
      .showHelpOnFail(true);
  }

  async initializeAPP() {
    try {
      if (this.argv.asktoken) {
        await this.getToken();
      }
      await this.initializeSystem();
      await this.initializeClients();
      await this.initializeModules();
    } catch (error) {
      throw new Error(error);
    }
  }

  async initializeSystem() {
    await SystemCheck.initialize();
  }

  async initializeClients() {
    const features = {
      music: SystemCheck.isFeatureEnabled("music"),
      ai: SystemCheck.isFeatureEnabled("openai"),
    };
    const activeFeatures = Object.entries(features)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);

    BotConsole.info(
      activeFeatures.length
        ? `Initializing client with ${activeFeatures.join(" and ")} feature${
            activeFeatures.length > 1 ? "s" : ""
          }`
        : "Initializing base client without additional features"
    );

    if (features.music && features.ai) {
      await clientInitializer.initialize();
      return;
    }

    await clientInitializer.initializeClientBase();
    if (features.music) await clientInitializer.initializeClientDistube();
    if (features.ai) await clientInitializer.initializeClientAI();
  }

  async initializeModules() {
    await loadModules.initialize();
  }

  async startBot() {
    const token = await this.getToken();
    await client.login(token);
    BotConsole.success("Bot successfully logged in " + client.user.tag);
  }
}

export default ApplicationManager;
