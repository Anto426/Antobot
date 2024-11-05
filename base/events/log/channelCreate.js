const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelCreate",
    typeEvent: "channelCreate",
    allowevents: true,
    async execute(channel) {
        return new Promise((resolve) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.addchannel(channel, tag);
            }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
        })

    }
}