const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log ready",
    typeEvent: "ready",
    async execute() {
        let logmodule = new log();
        logmodule.init().then(() => {
            const tag = true;
            logmodule.ready(tag);
        }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
    }
}