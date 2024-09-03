const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log inviteDelete",
    typeEvent: "inviteDelete",
    async execute(invite) {
        let logmodule = new log();
        logmodule.init().then(() => {
            const tag = true;
            logmodule.inviteDelete(invite, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}