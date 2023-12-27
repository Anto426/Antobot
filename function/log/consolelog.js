const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    white: '\x1b[37m',
};

function colorize(message, color) {
    const selectedColor = colors[color] || colors.reset;
    return `${selectedColor}${message}${colors.reset}`;
}

async function consolelog(message, color) {
    const messageColored = await colorize(message, color ? color : "white");

    const separatorLength = messageColored.length + 6; 
    const separator = colorize("=".repeat(separatorLength), "white"); 

    console.log(`${separator}\n=> ${messageColored}`);
}

module.exports = {
    consolelog
}
