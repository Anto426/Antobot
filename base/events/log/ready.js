const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log ready",
    typeEvent: "ready",
    async execute() {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.ready(tag);
        }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
    }
}