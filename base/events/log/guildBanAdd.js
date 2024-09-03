const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildBanAdd",
    typeEvent: "guildBanAdd",
    async execute(guildban) {
        const tag = true;
        let logmodule = new log();
        let console = new BotConsole();
        logmodule.init().then(() => {
            let user = guildban.user;
            let reason = guildban.reason;
            logmodule.guildBanAdd(user, reason, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}