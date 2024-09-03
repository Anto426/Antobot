const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelUpdate",
    typeEvent: "channelUpdate",
    async execute(oldChannel, newChannel) {
        let logchannel = new log();
        let console = new BotConsole();
        logchannel.init().then(() => {
            let changedprop = [];
            for (let key in oldChannel) {
                if (oldChannel[key] !== newChannel[key]) {
                    changedprop.push({ key: key, old: oldChannel[key], new: newChannel[key] });
                }
            }
            logchannel.deltechannel(newChannel, changedprop);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}