const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log emojiCreate",
    typeEvent: "emojiCreate",
    async execute(emoji) {
        const tag = true;
        let logchannel = new log();
        let console = new BotConsole();
        logchannel.init().then(() => {
            logchannel.emojiCreate(emoji, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}