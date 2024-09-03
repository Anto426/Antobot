const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log inviteCreate",
    typeEvent: "inviteCreate",
    allowevents: true,
    async execute(invite) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.inviteCreate(invite, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}