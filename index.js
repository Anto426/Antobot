import dotenv from "dotenv";
import ApplicationManager from "./class/client/ApplicationManager.js";
import BotConsole from "./class/console/BotConsole.js";
import { errorhandler } from "./class/error/ErrorHandler.js";
import LoadModules from "./class/Module/LoadModules.js";
import LoadOtherModules from "./class/Module/LoadOtherModules.js";

dotenv.config();

const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
  UNCAUGHT_ERROR: 2,
};

errorhandler.loadErrorCodes();

async function main() {
  const applicationManager = new ApplicationManager();

  // Initialize application
  const argv = applicationManager.configureYargs();
  await applicationManager.getToken(argv);
  await applicationManager.initializeClients();

  BotConsole.success("Application initialized successfully");
  return EXIT_CODES.SUCCESS;
}

// Global error handling
process.on("uncaughtException", async (error, origin) => {
  console.error("Uncaught Exception:");
  errorhandler.logError(error, origin);
  process.exit(EXIT_CODES.UNCAUGHT_ERROR);
});

process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled Rejection:");
  errorhandler.logError(reason);
  process.exit(EXIT_CODES.UNCAUGHT_ERROR);
});

// Run application
main()
  .then((exitCode) => process.exit(exitCode))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(EXIT_CODES.ERROR);
  });
