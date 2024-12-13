import console from "../console/Console.js";
import JsonHandler from "../json/JsonHandler.js";

let ERROR_CODE = {};



class ErrorHandler {
  constructor() {
    this.json = new JsonHandler();
  }

  async loadErrorcode() { 
    this.json = new JsonHandler();
    ERROR_CODE = await this.json.readFromFile('./class/error/ERROR_CODE.json');
  }

  logError = (errorCode, details = {}, originalError = null) => {
    try {
      const error = this.getErrorFromCode(errorCode);
      const errorMessage = this.formatErrorMessage(error, details);
      
      console.error(errorMessage);
      if (originalError) {
        console.error('Original error:', originalError);
      }
    } catch (err) {
      console.error('Error Handler Failed:', err.message);
      console.error('Attempted with code:', errorCode);
    }
  };


  throwError = (errorCode, details = {}) => {
    try {
      const error = this.getErrorFromCode(errorCode);
      const errorMessage = this.formatErrorMessage(error, details);
      throw new Error(errorMessage);
    } catch (err) {
      throw new Error(`Error Handler Failed: ${err.message}`);
    }
  };


  getErrorFromCode = (errorCode) => {
    const { section, category, type } = errorCode;
    
    if (!section || !category || !type) {
      throw new Error('Missing required error code components');
    }

    const errorInfo = ERROR_CODE[section]?.[category]?.[type];
    if (!errorInfo) {
      throw new Error(`Invalid error path: ${section}.${category}.${type}`);
    }

    return errorInfo;
  };


  formatErrorMessage = (error, details) => {
    const detailsStr = Object.keys(details).length > 0 
      ? ` - Details: ${JSON.stringify(details)}`
      : '';
    
    return `[${error.code}][ID:${error.id}] ${error.message}${detailsStr}`;
  };
}

// Export singleton instance
const errorhandler = new ErrorHandler();
export { ERROR_CODE, errorhandler };
