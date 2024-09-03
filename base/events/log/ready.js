const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log ready",
    typeEvent: "ready",
    async execute() {
        let logmodule = new log();
        let console = new BotConsole();
        logmodule.init().then(() => {
            const tag = true;
            logmodule.ready(tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}