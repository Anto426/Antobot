import BotConsole from "./class/console/BotConsole.js";
import ModuleLoader from "./class/Loader/ModuleLoader.js";
import ClientInitializer from "./class/client/ClientInitializer.js";
import SystemCheck from "./class/client/SystemCheck.js";
import ConfigManager from "./class/services/ConfigManager.js";
import SqlManager from "./class/services/SqlManager.js";
import dotenv from "dotenv";

dotenv.config();

function logError(error, name = "System") {
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
  };

  BotConsole.error(
    `[${name}] ${errorData.type}: ${errorData.message}`,
    errorData
  );
}

async function bootstrap() {
  const clientInitializer = new ClientInitializer();
  BotConsole.setLogLevel(process.env.LOG_LEVEL || "info");
  BotConsole.info("Starting bootstrap process...");
  await SystemCheck.initialize();
  await ConfigManager.loadConfig();
  if (SystemCheck.isFeatureEnabled("music"))
    clientInitializer.setCookies(ConfigManager.getConfig("cookies"));
  await clientInitializer.initialize();
  let sqlconfig = await ConfigManager.getConfig("sql");
  await SqlManager.connect(sqlconfig);
  const moduleLoader = new ModuleLoader();
  await moduleLoader.initialize();
  BotConsole.success("Bootstrap process completed.");
  return;
}

async function authenticate() {
  const token = process.env.TOKEN;
  if (!token) {
    throw new Error("TOKEN is not defined in the environment.");
  }
  await client.login(token);
  BotConsole.success(`Logged in as ${client.user.tag}`);
}

async function main() {
  process.stdout.write("\x1Bc");
  process.removeAllListeners("warning");

  let botClient = null;
  let isShuttingDown = false;

  const gracefulShutdown = async (origin, exitCode = 0, error = null) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    if (error) {
      logError(error, origin);
    } else {
      BotConsole.warning(`Received ${origin}. Initiating graceful shutdown...`);
    }

    BotConsole.info("Exiting process.");
    process.exit(exitCode);
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("uncaughtException", (error) =>
    gracefulShutdown("uncaughtException", 1, error)
  );
  process.on("unhandledRejection", (reason) =>
    gracefulShutdown("unhandledRejection", 1, reason)
  );

  try {
    BotConsole.info("Starting the bot...");
    await bootstrap();
    await authenticate();
    BotConsole.success("Bot is now running.");
  } catch (error) {
    logError(error, "Initialization");
    process.exit(1);
  }
}

main();
