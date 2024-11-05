const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log emojiCreate",
    typeEvent: "emojiCreate",
    allowevents: true,
    async execute(emoji) {
        return new Promise((resolve, reject) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.emojiCreate(emoji, tag);
            }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
        })
    }
}