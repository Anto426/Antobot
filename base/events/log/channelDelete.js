const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log channelDelete",
    typeEvent: "channelDelete",
    allowevents: true,
    async execute(channel) {
        return new Promise((resolve, reject) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(async () => {
                await logmodule.deltechannel(channel, tag).catch((err) => { reject(err) });
                resolve(0);
            }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
        })

    }
}