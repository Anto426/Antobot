const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelDelete",
    typeEvent: "channelDelete",
    async execute(channel) {
        let logchannel = new log();
        let console = new BotConsole();
        logchannel.init().then(() => {
            logchannel.deltechannel(channel);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}