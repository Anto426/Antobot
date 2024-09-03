const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelUpdate",
    typeEvent: "channelUpdate",
    async execute(oldChannel, newChannel) {
        let logchannel = new log();
        logchannel.init().then(() => {
            let changedprop = [];
            for (let key in oldChannel) {
                if (oldChannel[key] !== newChannel[key]) {
                    changedprop.push({ key: key, old: oldChannel[key], new: newChannel[key] });
                }
            }
            logchannel.deltechannel(newChannel, changedprop);
        }).catch(() => { this.console.log("Errore nell'inizializzare l'embed", "red") });
    }
}