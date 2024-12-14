import dotenv from "dotenv";
import ApplicationManager from "./class/client/ApplicationManager.js";
import BotConsole from "./class/console/BotConsole.js";
import { errorhandler } from "./class/error/ErrorHandler.js";

// Load environment variables at startup
dotenv.config();
process.removeAllListeners("warning");

const EXIT_CODES = Object.freeze({
  SUCCESS: 0,
  ERROR: 1,
  UNCAUGHT_ERROR: 2,
  SIGTERM: 143, // Standard SIGTERM exit code
});

// Initialize error handling and application setup
async function initializeApplication(applicationManager) {
  try {
    await errorhandler.initializeErrorCodes();
    await applicationManager.initializeAPP();
  } catch (error) {
    throw error;
  }
}

async function gracefulShutdown(exitCode = EXIT_CODES.SUCCESS) {
  BotConsole.warning("Shutting down gracefully...");
  process.exit(exitCode);
}

async function main() {
  try {
    const applicationManager = new ApplicationManager();
    await initializeApplication(applicationManager);
  } catch (error) {
    await handleFatalError(error);
    return EXIT_CODES.ERROR;
  }
}

// Global error handling
const handleFatalError = async (error, type = "error") => {
  const normalizedError =
    error instanceof Error
      ? error
      : new Error(typeof error === "string" ? error : JSON.stringify(error));

  const errorDetails = {
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
    }
  };

  errorhandler.logError(errorDetails);
};

// Error handlers
process.on("uncaughtException", (error) =>
  handleFatalError(error, "uncaughtException")
);
process.on("unhandledRejection", (reason) =>
  handleFatalError(reason, "unhandledRejection")
);
process.on("SIGTERM", () => gracefulShutdown(EXIT_CODES.SIGTERM));
process.on("SIGINT", () => gracefulShutdown(EXIT_CODES.SUCCESS));

// Start application
main().catch((error) => {
  handleFatalError(error);
  process.exit(EXIT_CODES.UNCAUGHT_ERROR);
});
