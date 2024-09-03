const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log emojiCreate",
    typeEvent: "emojiCreate",
    async execute(emoji) {
        let logchannel = new log();
        let console = new BotConsole();
        logchannel.init().then(() => {
            logchannel.emojiCreate(emoji);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}