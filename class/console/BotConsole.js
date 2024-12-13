import moment from 'moment';

class BotConsole {
    static #instance;

    #theme = {
        colors: {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            // Colori più vivaci
            red: '\x1b[38;5;196m',      // Rosso intenso
            green: '\x1b[38;5;46m',     // Verde lime
            yellow: '\x1b[38;5;220m',   // Giallo oro
            blue: '\x1b[38;5;39m',      // Blu elettrico
            magenta: '\x1b[38;5;201m',  // Magenta brillante
            cyan: '\x1b[38;5;51m',      // Ciano acqua
            white: '\x1b[38;5;255m',    // Bianco puro
            gray: '\x1b[38;5;245m',     // Grigio medio
            orange: '\x1b[38;5;208m',   // Arancione
            purple: '\x1b[38;5;141m',   // Viola pastello
            // Sfondi
            bgRed: '\x1b[41m',
            bgGreen: '\x1b[42m',
            bgYellow: '\x1b[43m',
            bgBlue: '\x1b[44m'
        },
        symbols: {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            debug: '🔧',
            trace: '🔍',
            arrow: '→',
            bullet: '•',
            property: '├─',
            lastProperty: '└─'
        },
        typeStyles: {
            info: { color: 'blue', symbol: 'info' },
            success: { color: 'green', symbol: 'success' },
            warning: { color: 'orange', symbol: 'warning' },
            error: { color: 'red', symbol: 'error' },
            debug: { color: 'purple', symbol: 'debug' },
            trace: { color: 'cyan', symbol: 'trace' }
        }
    };

    #config = {
        showTimestamp: true,
        timeFormat: 'HH:mm:ss.SSS',
        indent: 2,
        maxDepth: 4,
        maxArrayLength: 100,
        showTypes: true,
        logLevel: 'info',
        logToFile: false,
        logFilePath: './logs/console.log',
        showSource: true // Nuova opzione per mostrare il file e la riga
    };

    #logLevels = {
        error: 0,
        warning: 1,
        success: 2,
        info: 3,
        debug: 4,
        trace: 5
    };


    constructor() {
        if (BotConsole.#instance) return BotConsole.#instance;
        BotConsole.#instance = this;
        this.#initializeLogDirectory();
    }

    async #initializeLogDirectory() {
        if (this.#config.logToFile) {
            try {
                const { mkdir } = await import('fs/promises');
                await mkdir('./logs', { recursive: true });
            } catch (error) {
                console.error('Failed to create logs directory:', error);
            }
        }
    }

    #formatObject(obj, depth = 0) {
        if (depth >= this.#config.maxDepth) return this.#colorize('[Max Depth]', 'dim');
        if (obj === null) return this.#colorize('null', 'dim');
        
        const indent = ' '.repeat(this.#config.indent * depth);
        const entries = Object.entries(obj);
        
        if (entries.length === 0) return '{}';

        return entries.map(([key, value], index) => {
            const isLastItem = index === entries.length - 1;
            const prefix = isLastItem ? this.#theme.symbols.lastProperty : this.#theme.symbols.property;
            const formattedValue = this.#formatData(value, depth + 1);
            const typeInfo = this.#config.showTypes ? this.#colorize(` <${typeof value}>`, 'gray') : '';
            
            return `\n${indent}${this.#colorize(prefix, 'gray')} ${this.#colorize(key, 'white')}: ${formattedValue}${typeInfo}`;
        }).join('');
    }

    #formatData(data, depth = 0) {
        if (data === null) return this.#colorize('null', 'dim');
        if (data === undefined) return this.#colorize('undefined', 'dim');
        if (typeof data === 'string') return this.#colorize(`"${data}"`, 'green');
        if (typeof data === 'number') return this.#colorize(String(data), 'yellow');
        if (typeof data === 'boolean') return this.#colorize(String(data), 'magenta');
        if (data instanceof Error) {
            return `${this.#colorize(data.name, 'red')}: ${data.message}\n${this.#colorize(data.stack || '', 'dim')}`;
        }
        if (Array.isArray(data)) return this.#formatArray(data, depth);
        if (typeof data === 'object') return this.#formatObject(data, depth);
        return String(data);
    }

    #formatArray(arr, depth = 0) {
        if (!Array.isArray(arr)) return this.#formatData(arr, depth);
        if (arr.length === 0) return '[]';
        
        if (arr.length > this.#config.maxArrayLength) {
            const shown = arr.slice(0, this.#config.maxArrayLength);
            const remaining = arr.length - this.#config.maxArrayLength;
            return `[\n  ${shown.map(item => this.#formatData(item, depth + 1)).join(',\n  ')},\n  ... ${remaining} more items\n]`;
        }

        return `[\n  ${arr.map(item => this.#formatData(item, depth + 1)).join(',\n  ')}\n]`;
    }

    #colorize(text, color = 'white', background = null) {
        const colorCode = this.#theme.colors[color] || '';
        const bgCode = background ? this.#theme.colors[`bg${background.charAt(0).toUpperCase()}${background.slice(1)}`] || '' : '';
        return `${bgCode}${colorCode}${text}${this.#theme.colors.reset}`;
    }

    #getTimestamp() {
        return this.#config.showTimestamp 
            ? this.#colorize(`[${moment().format(this.#config.timeFormat)}]`, 'gray') 
            : '';
    }

    #getSourceLocation() {
        if (!this.#config.showSource) return '';
        const stack = new Error().stack;
        const caller = stack.split('\n')[4];
        if (!caller) return '';
        
        const match = caller.match(/at .+ \((.+):(\d+):(\d+)\)/) || caller.match(/at (.+):(\d+):(\d+)/);
        if (!match) return '';
        
        const [_, file, line] = match;
        const shortFile = file.split('/').pop();
        return this.#colorize(`[${shortFile}:${line}]`, 'dim');
    }

    #shouldLog(type) {
        return this.#logLevels[type] <= this.#logLevels[this.#config.logLevel];
    }

    async #writeToFile(message) {
        if (!this.#config.logToFile) return;
        
        try {
            const fs = await import('fs/promises');
            const cleanMessage = message.replace(/\x1b\[[0-9;]*m/g, '');
            await fs.appendFile(this.#config.logFilePath, `${cleanMessage}\n`);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    log(...args) {
        const type = typeof args[args.length - 1] === 'object' && args[args.length - 1]?.type 
            ? args.pop().type 
            : 'info';

        if (!this.#shouldLog(type)) return;

        const style = this.#theme.typeStyles[type];
        const symbol = this.#theme.symbols[style.symbol];
        const messages = args.map(arg => this.#formatData(arg)).join(' ');
        
        const prefix = [
            this.#getTimestamp(),
            this.#getSourceLocation(),
            this.#colorize(symbol, style.color),
            this.#colorize(this.#theme.symbols.arrow, style.color)
        ].filter(Boolean).join(' ');

        const fullMessage = `${prefix} ${messages}`;
        console.log(fullMessage);
        this.#writeToFile(fullMessage);
    }

    success(...args) { 
        const type = 'success';
        if (this.#shouldLog(type)) {
            this.log(...args, { type });
        }
    }
    
    error(...args) { 
        const type = 'error';
        if (this.#shouldLog(type)) {
            this.log(...args, { type });
        }
    }
    
    warning(...args) { 
        const type = 'warning';
        if (this.#shouldLog(type)) {
            this.log(...args, { type });
        }
    }
    
    info(...args) { 
        const type = 'info';
        if (this.#shouldLog(type)) {
            this.log(...args, { type });
        }
    }
    
    debug(...args) { 
        const type = 'debug';
        if (this.#shouldLog(type)) {
            this.log(...args, { type });
        }
    }
    
    trace(...args) { 
        const type = 'trace';
        if (this.#shouldLog(type)) {
            this.log(...args, { type });
        }
    }

    configure(options = {}) {
        Object.assign(this.#config, options);
        if (options.logToFile) this.#initializeLogDirectory();
    }

    getTheme() {
        return structuredClone(this.#theme);
    }

    getConfig() {
        return structuredClone(this.#config);
    }
}

export default new BotConsole();