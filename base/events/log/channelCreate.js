const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelCreate",
    typeEvent: "channelCreate",
    async execute(channel) {
        let logchannel = new log();
        let console = new BotConsole();
        logchannel.init().then(() => {
            logchannel.addchannel(channel);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}