const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
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
            logmodule.guildMemberUpdate(oldMember, changedprop, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}