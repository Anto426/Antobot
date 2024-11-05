const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log roleCreate",
    typeEvent: "roleCreate",
    allowevents: true,
    async execute(role) {
        return new Promise((resolve, reject) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.roleCreate(role, tag);
            }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
        })

    }
}