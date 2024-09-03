const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log roleCreate",
    typeEvent: "roleCreate",
    async execute(role) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.roleCreate(role, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}