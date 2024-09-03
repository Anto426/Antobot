const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log emojiUpdate",
    typeEvent: "emojiUpdate",
    async execute(oldEmoji, newEmoji) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.emojiUpdate(oldEmoji, newEmoji, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}