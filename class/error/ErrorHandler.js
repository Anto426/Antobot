import BotConsole from "../console/BotConsole.js";
import JsonHandler from "../json/JsonHandler.js";

// Constants
let ERROR_CODE = {};

class ErrorHandler {
  #json;
  #BotConsole;
  #initialized = false;

  constructor() {
    this.#json = new JsonHandler();
    this.#BotConsole = BotConsole;
  }

  async initializeErrorCodes() {
    if (this.#initialized) {
      return true;
    }

    try {
      this.#BotConsole.info('Initializing error codes...');
      const errorCodes = await this.#json.readFromFile("./config/ERROR_CODE.json");
      
      if (!errorCodes || typeof errorCodes !== 'object') {
        throw new Error('Invalid error codes format');
      }

      ERROR_CODE = Object.freeze({ ...errorCodes }); // Immutable error codes
      
      if (Object.keys(ERROR_CODE).length === 0) {
        throw new Error('Error codes file is empty');
      }

      this.#initialized = true;
      this.#BotConsole.success('Error codes initialized successfully');
      return true;
    } catch (error) {
      this.#BotConsole.error('Error codes initialization failed:', error);
      ERROR_CODE = Object.freeze({}); // Fallback to empty immutable object
      throw new Error(`Failed to initialize error codes: ${error.message}`);
    }
  }

  getErrorMessage(code) {
    if (!this.#initialized) {
      this.#BotConsole.warning('Error handler not initialized');
    }
    return ERROR_CODE[code] || `Unknown error code: ${code}`;
  }

  logError(error, name = 'System') {
    const timestamp = new Date().toISOString();
    const baseMetadata = { timestamp, source: name };

    if (!error) {
      this.#BotConsole.error(`[${name}] No error object provided`, baseMetadata);
      return;
    }

    switch (true) {
      case typeof error === 'string':
        this.#BotConsole.error(`[${name}] ${error}`, {
          ...baseMetadata,
          type: 'String Error'
        });
        break;

      case error instanceof Error:
        this.#BotConsole.error(`[${name}] ${error.name}: ${error.message}`, {
          ...baseMetadata,
          stack: error.stack,
          type: error.name || 'Error'
        });
        break;

      case error && typeof error === 'object' && 'code' in error:
        const errorMessage = this.getErrorMessage(error.code);
        this.#BotConsole.error(
          `[${name}][${error.code}] ${errorMessage}`,
          {
            ...baseMetadata,
            errorId: error.id || 'UNKNOWN',
            severity: error.severity || 'ERROR',
            details: error.message || errorMessage,
            stack: error.stack
          }
        );
        break;

      default:
        this.#BotConsole.error(`[${name}] Unexpected error format:`, {
          ...baseMetadata,
          error,
          type: typeof error
        });
    }
  }
}

const errorhandler = new ErrorHandler();
export { errorhandler, ERROR_CODE };
