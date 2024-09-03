const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelCreate",
    typeEvent: "channelCreate",
    async execute(channel) {
        let logchannel = new log();
        logchannel.init().then(() => {
            logchannel.addchannel(channel);
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }
}