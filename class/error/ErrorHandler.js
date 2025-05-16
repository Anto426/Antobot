import BotConsole from "../console/BotConsole.js";
import JsonHandler from "../json/JsonHandler.js";

class ErrorHandler {
  #json;
  #BotConsole;

  constructor() {
    this.#json = new JsonHandler();
    this.#BotConsole = BotConsole;
    this.initializeGlobalErrorHandlers();
  }

  initializeGlobalErrorHandlers() {
    process.on("uncaughtException", (error) => {
      this.logError(error, "uncaughtException");
      process.exit(1);
    });
    process.on("unhandledRejection", (reason) => {
      this.logError(reason, "unhandledRejection");
      process.exit(1);
    });
    process.on("SIGTERM", () => {
      this.logError("Received SIGTERM signal", "Process");
      process.exit(0);
    });
    process.on("SIGINT", () => {
      this.logError("Received SIGINT signal", "Process");
      process.exit(0);
    });
  }

  logError(error, name = "System") {
    const timestamp = new Date().toISOString();
    const metadata = { timestamp, source: name };

    if (!error) {
      this.#BotConsole.error(`[${name}] No error object provided`, metadata);
      return;
    }

    const errorData = {
      ...metadata,
      type: error.name || typeof error,
      message: error.message || String(error),
    };

    if (error.stack) {
      errorData.stack = error.stack;
    }

    if (error.options) {
      errorData.options = error.options;
    }

    this.#BotConsole.error(
      `[${name}] ${errorData.type}: ${errorData.message}`,
      errorData
    );
  }
}

const errorhandler = new ErrorHandler();
export { errorhandler };
