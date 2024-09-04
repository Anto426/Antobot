const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildMemberRemove",
    typeEvent: "guildMemberRemove",
    allowevents: true,
    async execute(member) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            logmodule.guildMemberRemove(member, tag);
        }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
    }
}