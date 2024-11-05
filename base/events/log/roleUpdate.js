const { log } = require("../../../function/log/log");

module.exports = {
    name: "Log roleUpdate",
    typeEvent: "roleUpdate",
    allowevents: true,
    async execute(oldRole, newRole) {
        return new Promise(async (resolve, reject) => {
            const tag = false;
            let logmodule = new log();

            await logmodule.init().then(() => {

                let changedprop = [];
                const keys = [
                    { key: "name", label: "📛 Name" },
                    { key: "color", label: "🎨 Color" },
                    { key: "hoist", label: "📌 Hoisted" },
                    { key: "position", label: "📍 Position" },
                    { key: "mentionable", label: "📣 Mentionable" }
                ];

                keys.forEach(({ key, label }) => {
                    if (oldRole[key] !== newRole[key]) {
                        changedprop.push({ key: label, old: oldRole[key], new: newRole[key] });
                    }
                });

                if (changedprop.length > 0)
                    logmodule.roleUpdate(newRole, changedprop, tag);

            }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
        })

    }
}