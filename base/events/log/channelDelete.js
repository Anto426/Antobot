const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelDelete",
    typeEvent: "channelDelete",
    async execute(channel) {
        let logchannel = new log();
        logchannel.init().then(() => {
            logchannel.deltechannel(channel);
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }
}