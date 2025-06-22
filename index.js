import ApplicationManager from "./class/client/ApplicationManager.js";
import BotConsole from "./class/console/BotConsole.js";
import errorhandler from "./class/error/ErrorHandler.js";

process.stdout.write("\x1Bc");
process.removeAllListeners("warning");

class ApplicationBootstrap {
  #isShuttingDown = false;

  async initialize() {
    errorhandler.initializeGlobalErrorHandlers();
    try {
      await ApplicationManager.run();
    } catch (error) {
      BotConsole.error(
        "Failed to initialize application:",
        error?.stack || error?.message || error
      );
      await this.shutdown(1);
    }
  }

  async shutdown(exitCode = 0) {
    if (this.#isShuttingDown) return;
    this.#isShuttingDown = true;
    BotConsole.warning(`Initiating graceful shutdown with code ${exitCode}...`);
    process.exit(exitCode);
  }
}

(async () => {
  const app = new ApplicationBootstrap();

  const handleSignal = async (signal) => {
    BotConsole.warning(`Received ${signal}. Shutting down...`);
    await app.shutdown(0);
  };

  process.once("SIGINT", handleSignal);
  process.once("SIGTERM", handleSignal);

  await app.initialize();
})();
