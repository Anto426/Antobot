const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildMemberRemove",
    typeEvent: "guildMemberRemove",
    allowevents: true,
    async execute(member) {
        
        let logmodule = new log();
        logmodule.init().then(() => {
            if (!member.user.bot) {
                logmodule.guildMemberRemove(member, tag);
            } else {
                tag = false;
                logmodule.guildMemberRemoveBot(member, tag);
            }
        }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
    }
}