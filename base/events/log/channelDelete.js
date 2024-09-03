const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelDelete",
    typeEvent: "channelDelete",
    async execute(channel) {
        const tag = true;
        let logchannel = new log();
        let console = new BotConsole();
        logchannel.init().then(() => {
            logchannel.deltechannel(channel, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}