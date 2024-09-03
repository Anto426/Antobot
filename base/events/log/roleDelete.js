const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log roleDelete",
    typeEvent: "roleDelete",
    async execute(role) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.roleDelete(role, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}