const { log } = require("../../../function/log/log");

module.exports = {
    name: "Log roleUpdate",
    typeEvent: "roleUpdate",
    allowevents: true,
    async execute(oldRole, newRole) {
        return new Promise(async (resolve, reject) => {
            const tag = false;
            let logmodule = new log();

            await logmodule.init().then(() => {



            }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
        })

    }
}