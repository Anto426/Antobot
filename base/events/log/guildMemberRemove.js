const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildMemberRemove",
    typeEvent: "guildMemberRemove",
    allowevents: true,
    async execute(member) {
        return new Promise((resolve, reject) => {
            let logmodule = new log();
            logmodule.init().then(() => {
                if (!member.user.bot) {
                    logmodule.guildMemberRemove(member);
                } else {
                    tag = false;
                    logmodule.guildMemberRemoveBot(member);
                }
            }).catch((err) => { console.log(err); console.log("Errore nell'inizializzare il modulo log") });
        })

    }
}