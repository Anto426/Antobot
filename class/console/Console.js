import moment from 'moment';

class BotConsole {
    // Theme configuration
    #theme = {
        colors: {
            reset: '\x1b[0m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            gray: '\x1b[90m',

            bgRed: '\x1b[41m',
            bgGreen: '\x1b[42m',
            bgYellow: '\x1b[43m',
            bgBlue: '\x1b[44m'
        },
        symbols: {
            info: '📝',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            debug: '🐛',
            trace: '🔍'
        },
        typeStyles: {
            info: { color: 'cyan', symbol: 'info' },
            success: { color: 'green', symbol: 'success' },
            warning: { color: 'yellow', symbol: 'warning' },
            error: { color: 'red', symbol: 'error' },
            debug: { color: 'magenta', symbol: 'debug' },
            trace: { color: 'blue', symbol: 'trace' }
        }
    };

    // Format configurations
    #config = {
        showTimestamp: true,
        timeFormat: 'HH:mm:ss',
        indent: 2
    };

    /**
     * Formats any data type into a readable string
     */
    #formatData(data, level = 0) {
        if (data === null) return 'null';
        if (data === undefined) return 'undefined';
        if (typeof data === 'string') return data;
        if (typeof data === 'number' || typeof data === 'boolean') return String(data);
        if (Array.isArray(data)) {
            return data.map(item => this.#formatData(item)).join(', ');
        }
        if (typeof data === 'object') {
            return JSON.stringify(data, null, this.#config.indent);
        }
        return String(data);
    }

    /**
     * Applies color to text
     */
    #colorize(text, color = 'white', background = null) {
        const colorCode = this.#theme.colors[color] || this.#theme.colors.reset;
        const bgCode = background ? (this.#theme.colors[`bg${background.charAt(0).toUpperCase()}${background.slice(1)}`] || '') : '';
        return `${bgCode}${colorCode}${text}${this.#theme.colors.reset}`;
    }

    /**
     * Creates the timestamp string
     */
    #getTimestamp() {
        return this.#config.showTimestamp 
            ? this.#colorize(`[${moment().format(this.#config.timeFormat)}]`, 'gray') 
            : '';
    }

    /**
     * Main logging method
     */
    log(message, type = 'info', options = {}) {
        const style = this.#theme.typeStyles[type] || this.#theme.typeStyles.info;
        const symbol = this.#theme.symbols[style.symbol];
        const formattedMessage = this.#formatData(message);
        
        const output = [
            this.#getTimestamp(),
            this.#colorize(symbol, style.color),
            this.#colorize(formattedMessage, style.color)
        ].filter(Boolean).join(' ');

        console.log(output);
    }

    // Convenience methods
    success(message, options = {}) { this.log(message, 'success', options); }
    error(message, options = {}) { this.log(message, 'error', options); }
    warning(message, options = {}) { this.log(message, 'warning', options); }
    info(message, options = {}) { this.log(message, 'info', options); }
    debug(message, options = {}) { this.log(message, 'debug', options); }
    trace(message, options = {}) { this.log(message, 'trace', options); }

    // Configuration methods
    setTimeFormat(format) {
        this.#config.timeFormat = format;
    }

    toggleTimestamp(show) {
        this.#config.showTimestamp = show;
    }

    setIndentation(spaces) {
        this.#config.indent = spaces;
    }
}

export default new BotConsole();