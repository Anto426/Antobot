const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log emojiDelete",
    typeEvent: "emojiDelete",
    allowevents: true,
    async execute(emoji) {
        const tag = false;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.emojiDelete(emoji, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}