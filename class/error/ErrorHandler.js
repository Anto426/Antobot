import BotConsole from "../console/BotConsole.js";
import JsonHandler from "../json/JsonHandler.js";

class ErrorHandler {
  #json;
  #exitHandled = false;
  #logFile;

  constructor(logFile) {
    this.#json = new JsonHandler();
    this.#logFile = logFile;
    this.initializeGlobalErrorHandlers();
  }

  initializeGlobalErrorHandlers() {
    process.on("uncaughtException", (error) => {
      this.logError(error, "uncaughtException");
    });
    process.on("unhandledRejection", (reason) => {
      this.logError(reason, "unhandledRejection");
    });
    process.on("SIGTERM", () => {
      this.handleExit("SIGTERM");
    });
    process.on("SIGINT", () => {
      this.handleExit("SIGINT");
    });
  }

  handleExit(signal) {
    if (this.#exitHandled) return;
    this.#exitHandled = true;
    this.logError(`Received ${signal} signal`, "Process");
    process.exit(0);
  }

  logError(error, name = "System") {
    const timestamp = new Date().toISOString();
    const metadata = { timestamp, source: name };

    if (!error) {
      BotConsole.error(`[${name}] No error object provided`, metadata);
      return;
    }

    const errorData = {
      ...metadata,
      type: error.name || typeof error,
      message: error.message || String(error),
      stack: error.stack || undefined,
      options: error.options || undefined,
    };

    BotConsole.error(
      `[${name}] ${errorData.type}: ${errorData.message}`,
      errorData
    );

    if (this.#logFile) {
      this.#json.append(this.#logFile, errorData);
    }
  }
}

export default new ErrorHandler();
