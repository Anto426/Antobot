class BotConsole {

    constructor() {
        this.colors = {
            reset: '\x1b[0m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            white: '\x1b[37m',
        };
    }

    async colorize(data, color) {
        const selectedColor = this.colors[color] || this.colors.reset;
        let message = '';

        if (typeof data === 'string') {
            message = data;
        } else if (Array.isArray(data)) {
            message = JSON.stringify(data);
        } else if (typeof data === 'object') {
            message = JSON.stringify(data);
        }

        return `${selectedColor}${message}${this.colors.reset}`;
    }

    async log(message, color) {
        const messageColored = await this.colorize(message, color ? color : "white");
        const separatorLength = messageColored.length + 6;
        const separator = this.colorize("=".repeat(separatorLength), "white");

        console.log(`${separator}\n=> ${messageColored}`);
    }
}
module.exports = {
    BotConsole
}
