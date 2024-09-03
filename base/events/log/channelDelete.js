const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelDelete",
    typeEvent: "channelDelete",
    allowevents: true,
    async execute(channel) {
        const tag = false;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.deltechannel(channel, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}