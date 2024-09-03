const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log inviteCreate",
    typeEvent: "inviteCreate",
    async execute(invite) {
        let logmodule = new log();
        logmodule.init().then(() => {
            const tag = true;
            logmodule.inviteCreate(invite, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}