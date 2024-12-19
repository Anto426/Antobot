import dotenv from "dotenv";
import ApplicationManager from "./class/client/ApplicationManager.js";
import BotConsole from "./class/console/BotConsole.js";
import { errorhandler } from "./class/error/ErrorHandler.js";

process.stdout.write('\x1Bc');
dotenv.config();
process.removeAllListeners("warning");

class ApplicationBootstrap {
  constructor() {
    this.applicationManager = new ApplicationManager();
  }

  async initialize() {
    errorhandler.initializeGlobalErrorHandlers();
    try {
      await this.applicationManager.initializeAPP();
      BotConsole.success("Application successfully initialized");
    } catch (error) {
      BotConsole.error("Failed to initialize application:", error.message);
      await this.shutdown(1);
    }
  }

  async shutdown(exitCode = 0) {
    BotConsole.warning(`Initiating graceful shutdown with code ${exitCode}...`);
    process.exit(exitCode);
  }
}

(async () => {
  const app = new ApplicationBootstrap();
  await app.initialize();
})();
