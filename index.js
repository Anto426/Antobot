import dotenv from "dotenv";
import ApplicationManager from "./class/client/ApplicationManager.js";
import console from "./class/console/Console.js";
import { errorhandler } from "./class/error/ErrorHandler.js";

// Load environment variables
dotenv.config();

// Exit code constants
const EXIT_CODES = {
  SUCCESS: 0,
  ERROR: 1,
};

errorhandler.loadErrorcode();

// Main function
const main = async () => {
  const applicationManager = new ApplicationManager();
  const argv = applicationManager.configureYargs();
  const token = await applicationManager.getToken(argv);
  await applicationManager.initializeClients();

  console.log("Application initialized successfully");
  return EXIT_CODES.SUCCESS;
};

process.on("uncaughtException", async(err, origin) => {
  errorhandler.logError(err, origin);
});

main();
