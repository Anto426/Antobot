const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log guildUpdate",
    typeEvent: "guildUpdate",
    async execute(newGuild, oldGuild) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            let changedprop = [];
            for (let key in oldGuild) {
                if (oldGuild[key] !== newGuild[key]) {
                    changedprop.push({ key: key, old: oldMember[key], new: newMember[key] });
                }
            }
            logmodule.guildUpdate(newGuild, changedprop, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}