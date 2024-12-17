import dotenv from "dotenv";
import ApplicationManager from "./class/client/ApplicationManager.js";
import BotConsole from "./class/console/BotConsole.js";
import { errorhandler } from "./class/error/ErrorHandler.js";

process.stdout.write('\x1Bc')
dotenv.config();
process.removeAllListeners("warning");

const EXIT_CODES = Object.freeze({
  SUCCESS: 0,
  ERROR: 1,
  UNCAUGHT_ERROR: 2,
  SIGTERM: 143,
  INITIALIZATION_ERROR: 3,
});

class ApplicationBootstrap {
  constructor() {
    this.applicationManager = new ApplicationManager();
  }

  async initialize() {
    try {
      await errorhandler.initializeErrorCodes();
      this.applicationManager.configureYargs();
      await this.applicationManager.initializeAPP();
      return true;
    } catch (error) {
      await handleFatalError(error, "initialization");
      return false;
    }
  }

  async shutdown(exitCode = EXIT_CODES.SUCCESS) {
    BotConsole.warning(`Initiating graceful shutdown with code ${exitCode}...`);
    try {
      await Promise.allSettled([]);
      return exitCode;
    } catch (error) {
      await handleFatalError(error, "shutdown");
      return EXIT_CODES.ERROR;
    }
  }
}

class ErrorManager {
  static createErrorDetails(error, type = "error") {
    const normalizedError =
      error instanceof Error
        ? error
        : new Error(typeof error === "string" ? error : JSON.stringify(error));

    return {
      type,
      message: normalizedError.message || "Unknown error",
      stack: normalizedError.stack,
      timestamp: new Date().toISOString(),
      severity: "FATAL",
      errorCode: normalizedError.code || "SYSTEM_ERROR_HANDLING_FAILED",
      errorId: normalizedError.id || 4002,
      context: {
        processId: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      },
    };
  }
}

// Error handling function
const handleFatalError = async (error, type = "error") => {
  const formattedError = (() => {
    if (error && typeof error === "object") {
      return error;
    }
    return {
      message: typeof error === "string" ? error : String(error),
      code: "SYSTEM_ERROR_HANDLING_FAILED",
      id: 4002,
      severity: "critical",
    };
  })();

  const errorDetails = ErrorManager.createErrorDetails(formattedError, type);
  await errorhandler.logError(errorDetails);
};

// Main application execution
async function main() {
  const app = new ApplicationBootstrap();

  // Setup process handlers
  process.on("uncaughtException", (error) =>
    handleFatalError(error, "uncaughtException")
  );
  process.on("unhandledRejection", (reason) =>
    handleFatalError(reason, "unhandledRejection")
  );
  process.on("SIGTERM", async () =>
    process.exit(await app.shutdown(EXIT_CODES.SIGTERM))
  );
  process.on("SIGINT", async () =>
    process.exit(await app.shutdown(EXIT_CODES.SUCCESS))
  );

  // Initialize application
  if (await app.initialize()) {
    BotConsole.info("Application successfully initialized");
    return EXIT_CODES.SUCCESS;
  }

  return EXIT_CODES.INITIALIZATION_ERROR;
}

// Start application with enhanced error handling
main()
  .then((exitCode) => {
    if (exitCode !== EXIT_CODES.SUCCESS) {
      process.exit(exitCode);
    }
  })
  .catch(async (error) => {
    await handleFatalError(error, "fatal");
    process.exit(EXIT_CODES.UNCAUGHT_ERROR);
  });
