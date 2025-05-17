import ApplicationManager from "./class/client/ApplicationManager.js";
import BotConsole from "./class/console/BotConsole.js";
import { errorhandler } from "./class/error/ErrorHandler.js";

process.stdout.write("\x1Bc");
process.removeAllListeners("warning");

class ApplicationBootstrap {
  async initialize() {
    errorhandler.initializeGlobalErrorHandlers();
    try {
      await ApplicationManager.run();
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
