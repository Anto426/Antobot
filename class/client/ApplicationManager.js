import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import readline from "readline";
import BotConsole from "../console/BotConsole.js";
import clientInitializer from "./ClientInitializer.js";
import { ERROR_CODE } from "./../error/ErrorHandler.js";
import SystemCheck from "./SystemCheck.js";
import loadModules from "./../Module/LoadModules.js";

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
        throw new Error(ERROR_CODE.applicationManager.token);
      }

      return token;
    } catch (error) {
      BotConsole.error('Failed to get token:', error.message);
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
        BotConsole.info('Please provide your Discord bot token');
        rl.question('Token: ', (input) => {
          const trimmedInput = input.trim();
          if (!trimmedInput) {
            reject(new Error(ERROR_CODE.applicationManager.token));
          } else if (trimmedInput.length < 50) {
            reject(new Error('Token appears to be invalid (too short)'));
          } else {
            resolve(trimmedInput);
          }
        });
      });

      process.env.TOKEN = token;
      BotConsole.success('Token successfully stored');
      return token;
    } catch (error) {
      BotConsole.error('Token input failed:', error.message);
      throw error;
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
      await this.startBot();
    } catch (error) {
      BotConsole.error('Application initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Initializes system checks
   * @private
   */
  async initializeSystem() {
    await SystemCheck.initialize();
  }

  /**
   * Initializes appropriate clients based on enabled features
   * @private
   */
  async initializeClients() {
    const hasMusic = SystemCheck.isFeatureEnabled("music");
    const hasAI = SystemCheck.isFeatureEnabled("openai");

    if (hasMusic && hasAI) {
      BotConsole.info("Initializing full client with music and AI features");
      await clientInitializer.initialize();
      return;
    }

    await clientInitializer.initializeClientBase();
    
    if (hasMusic) {
      await clientInitializer.initializeClientDistube();
    } else if (hasAI) {
      await clientInitializer.initializeClientAI();
    }
  }

  /**
   * Initializes modules
   * @private
   */
  async initializeModules() {
    await loadModules.initialize();
    BotConsole.success("All modules loaded successfully");
  }

  /**
   * Starts the bot with the token
   * @private
   */
  async startBot() {
    const token = await this.getToken();
    await client.login(token);
    BotConsole.success("Bot successfully logged in");
  }
}

export default ApplicationManager;
