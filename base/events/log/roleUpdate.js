const { log } = require("../../../function/log/log");
module.exports = {
    name: "Log roleUpdate",
    typeEvent: "roleUpdate",
    async execute(oldRole, newRole) {
        const tag = true;
        let logmodule = new log();
        logmodule.init().then(() => {
            let changedprop = [];
            for (let key in oldRole) {
                if (oldRole[key] !== newRole[key]) {
                    changedprop.push({ key: key, old: oldRole[key], new: newRole[key] });
                }
            }
            logmodule.roleUpdate(newChannel, changedprop, tag);
        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
    }
}