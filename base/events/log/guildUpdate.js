const { BotConsole } = require("../../../function/log/botConsole");
const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildUpdate",
    typeEvent: "guildUpdate",
    async execute(newGuild, oldGuild) {
        let logmodule = new log();
        let console = new BotConsole();
        logmodule.init().then(() => {
            const tag = true;
            let changedprop = [];
            for (let key in oldGuild) {
                if (oldGuild[key] !== newGuild[key]) {
                    changedprop.push({ key: key, old: oldMember[key], new: newMember[key] });
                }
            }
            logmodule.guildMemberUpdate(newMember, changedprop, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log", "red") });
    }
}