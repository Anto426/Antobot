import console from '../console/BotConsole.js';
import JsonHandler from '../json/JsonHandler.js';

// Constants
const ERROR_SEVERITY = {
  CRITICAL: 'critical',
  MAJOR: 'major',
  INFO: 'info'
};

const ERROR_COLORS = {
  critical: '\x1b[31m', // red
  major: '\x1b[33m',    // yellow
  info: '\x1b[36m',     // cyan
  unregistered: '\x1b[35m', // magenta
  header: '\x1b[1;34m',  // bright blue
  details: '\x1b[37m'    // white
};

const RESET_COLOR = '\x1b[0m';

let ERROR_CODE = {};

class ErrorHandler {
  #errorCount = 0;
  #errorHistory = [];
  #maxHistorySize = 50;
  #jsonHandler;
  #version = '1.0.0'; // Add version tracking

  constructor() {
    this.#jsonHandler = new JsonHandler();
    this.initialize();
  }

  async initialize() {
    await this.loadErrorCodes();
  }

  async loadErrorCodes() {
    try {
      ERROR_CODE = await this.#jsonHandler.readFromFile('./class/error/ERROR_CODE.json');
    } catch (error) {
      this.#logInternalError('Failed to load error codes', error);
    }
  }

  logError(code, details = {}, originalError = null) {
    try {
      this.#errorCount++;
      const error = this.#buildError(code, details, originalError);
      this.#updateHistory(error);
      this.#displayError(error);
      this.#processSeverity(error);
      return error.id; // Return error ID for reference
    } catch (err) {
      this.#logInternalError('Error logging failed', err);
    }
  }

  getErrorCodes() {
    return ERROR_CODE;
  }

  getStats() {
    return {
      total: this.#errorCount,
      recent: this.#errorHistory.length,
      version: this.#version
    };
  }

  // Private Methods
  #buildError(code, details, originalError) {
    const registeredError = this.#lookupErrorCode(code);
    const stack = originalError?.stack?.split('\n').slice(1).map(line => line.trim()) || [];
    
    return {
      id: this.#errorCount,
      timestamp: new Date().toISOString(),
      code,
      type: registeredError ? 'registered' : 'unregistered',
      message: registeredError?.message || originalError?.message,
      details: Object.keys(details).length > 0 ? details : undefined,
      severity: registeredError?.severity || ERROR_SEVERITY.INFO,
      stack,
      path: process.cwd(),
      nodeVersion: process.version
    };
  }

  #lookupErrorCode(code) {
    const paths = code?.split('.') || [];
    return paths.reduce((obj, path) => obj?.[path], ERROR_CODE);
  }

  #updateHistory(error) {
    this.#errorHistory.unshift(error);
    if (this.#errorHistory.length > this.#maxHistorySize) {
      this.#errorHistory.pop();
    }
  }

  #displayError(error) {
    const color = ERROR_COLORS[error.severity] || ERROR_COLORS.info;
    const headerColor = ERROR_COLORS.header;
    const detailsColor = ERROR_COLORS.details;

    const border = '═'.repeat(50);
    const errorDisplay = [
      `\n${headerColor}╔${border}╗${RESET_COLOR}`,
      `${headerColor}║${color} Error #${error.id.toString().padEnd(42)} ${headerColor}║${RESET_COLOR}`,
      `${headerColor}╠${border}╣${RESET_COLOR}`,
      `${color}║ Type:${detailsColor} ${error.type.toUpperCase().padEnd(43)}${color}║${RESET_COLOR}`,
      `${color}║ Code:${detailsColor} ${error.code.padEnd(43)}${color}║${RESET_COLOR}`,
      `${color}║ Severity:${detailsColor} ${error.severity.toUpperCase().padEnd(39)}${color}║${RESET_COLOR}`,
      `${color}║ Time:${detailsColor} ${error.timestamp.padEnd(43)}${color}║${RESET_COLOR}`,
      `${color}║ Node:${detailsColor} ${error.nodeVersion.padEnd(43)}${color}║${RESET_COLOR}`,
      error.message && `${color}║ Message:${detailsColor} ${this.#wrapText(error.message, 41).join(`${color}║${detailsColor}         `)}${color}║${RESET_COLOR}`,
      error.details && `${color}║ Details:${detailsColor}\n${JSON.stringify(error.details, null, 2).split('\n').map(line => `${color}║${detailsColor} ${line.padEnd(47)}${color}║`).join('\n')}${RESET_COLOR}`,
      error.stack.length > 0 && `${color}║ Stack:${detailsColor}\n${error.stack.map(line => `${color}║${detailsColor} ${line.padEnd(47)}${color}║`).join('\n')}${RESET_COLOR}`,
      `${headerColor}╚${border}╝${RESET_COLOR}`
    ].filter(Boolean);

    console.error(errorDisplay.join('\n'));
  }

  #wrapText(text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      if (currentLine.length + word.length <= maxLength) {
        currentLine += (currentLine.length === 0 ? '' : ' ') + word;
      } else {
        lines.push(currentLine.padEnd(maxLength));
        currentLine = word;
      }
    });
    lines.push(currentLine.padEnd(maxLength));
    return lines;
  }

  #processSeverity(error) {
    switch (error.severity) {
      case ERROR_SEVERITY.CRITICAL:
        console.error(`CRITICAL ERROR: ${error.message}`);
        break;
      case ERROR_SEVERITY.MAJOR:
        console.warn(`MAJOR ERROR: ${error.message}`);
        break;
    }
  }

  #logInternalError(message, error) {
    console.error(`Internal Error: ${message} - ${error.message}`);
  }
}

const errorhandler = new ErrorHandler();
export { errorhandler, ERROR_CODE };
