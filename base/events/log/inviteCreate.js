const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log inviteCreate",
    typeEvent: "inviteCreate",
    allowevents: true,
    async execute(invite) {
        return new Promise((resolve, reject) => {
            const tag = false;
            let logmodule = new log();
            logmodule.init().then(() => {
                logmodule.inviteCreate(invite, tag);
            }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
        })

    }
}