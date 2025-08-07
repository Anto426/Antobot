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

  const errorData = {
    ...metadata,
    type: error?.name || typeof error,
    message: error?.message || String(error),
    stack: error?.stack || undefined,
  };

  BotConsole.error(
    `[${name}] ${errorData.type}: ${errorData.message}`,
    errorData
  );
}

async function bootstrap(clientInitializer) {
  BotConsole.setLogLevel(process.env.LOG_LEVEL || "info");
  BotConsole.info("🔧 Inizio processo di bootstrap...");

  await SystemCheck.initialize();
  await ConfigManager.loadConfig();

  if (SystemCheck.isFeatureEnabled("music")) {
    const cookies = ConfigManager.getConfig("cookies");
    if (cookies) {
      clientInitializer.setCookies(cookies);
    }
  }

  await clientInitializer.initialize();

  const sqlConfig = ConfigManager.getConfig("sql");
  await SqlManager.connect(sqlConfig);

  const moduleLoader = new ModuleLoader();
  await moduleLoader.initialize();

  BotConsole.success("✅ Bootstrap completato.");
}

async function authenticate() {
  const token = process.env.TOKEN;
  if (!token) {
    throw new Error("TOKEN non definito nel file .env.");
  }

  await client.login(token);
  BotConsole.success(`🟢 Autenticato come ${client.user.tag}`);
}

function setupProcessHandlers() {
  let isShuttingDown = false;

  const shutdown = async (origin, exitCode = 0, error = null) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    if (error) {
      logError(error, origin);
    } else {
      BotConsole.warning(`⚠️ Ricevuto segnale ${origin}. Chiusura in corso...`);
    }

    BotConsole.info("🔴 Arresto processo...");
    process.exit(exitCode);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("uncaughtException", (err) =>
    shutdown("uncaughtException", 1, err)
  );
  process.on("unhandledRejection", (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    shutdown("unhandledRejection", 1, error);
  });
}

async function main() {
  process.stdout.write("\x1Bc");
  setupProcessHandlers();

  try {
    BotConsole.info("🚀 Avvio del bot...");

    const clientInitializer = new ClientInitializer();
    await bootstrap(clientInitializer);
    await authenticate();

    BotConsole.success("🤖 Bot avviato con successo.");
  } catch (error) {
    logError(error, "Main");
    process.exit(1);
  }
}

main();
