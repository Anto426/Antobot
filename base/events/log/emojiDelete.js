const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log emojiDelete",
    typeEvent: "emojiDelete",
    async execute(emoji) {
        const tag = true;
        let logmodule = new log();
        let console = new BotConsole();
        logmodule.init().then(() => {
            logmodule.emojiDelete(emoji, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}