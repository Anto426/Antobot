const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildBanRemove",
    typeEvent: "guildBanRemove",
    async execute(guildban) {
        const tag = true;
        let logmodule = new log();
        let console = new BotConsole();
        logmodule.init().then(() => {
            logmodule.guildBanRemove(guildban, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}