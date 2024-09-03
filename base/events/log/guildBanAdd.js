const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildBanAdd",
    typeEvent: "guildBanAdd",
    async execute(guildban) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.guildBanAdd(guildban, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}