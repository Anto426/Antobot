const { BotConsole } = require("../../../function/log/botConsole");
module.exports = {
    name: "Log guildMemberUpdate",
    typeEvent: "guildMemberUpdate",
    async execute(oldMember, newMember) {
        let logmodule = new log();
        let console = new BotConsole();
        const tag = true;
        
        logmodule.init().then(() => {
            let changedprop = [];
            for (let key in oldMember) {
                if (oldMember[key] !== newMember[key]) {
                    changedprop.push({ key: key, old: oldMember[key], new: newMember[key] });
                }
            }
            logmodule.guildMemberUpdate(newMember, changedprop, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}