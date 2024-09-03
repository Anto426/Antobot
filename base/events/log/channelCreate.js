const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelCreate",
    typeEvent: "channelCreate",
    async execute(channel) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.addchannel(channel, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}