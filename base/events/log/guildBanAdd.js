const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildBanAdd",
    typeEvent: "guildBanAdd",
    allowevents: true,
    async execute(guildban) {
        
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.guildBanAdd(guildban, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}