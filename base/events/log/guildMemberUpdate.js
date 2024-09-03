const { log } = require("../../../function/log/log");

module.exports = {
    name: "Log guildMemberUpdate",
    typeEvent: "guildMemberUpdate",
    allowevents: true,
    async execute(oldMember, newMember) {
        let logmodule = new log();
        const tag = false;

        await logmodule.init().then(() => {
            
            let changedprop = [];

            const memberKeys = [
                { key: "nickname", label: "👤 Nickname" },
            ];

            memberKeys.forEach(({ key, label }) => {
                if (oldMember[key] !== newMember[key]) {
                    changedprop.push({ key: label, old: oldMember[key], new: newMember[key] });
                }
            });

            const userKeys = [
                { key: "username", label: "👤 Username" },
                { key: "discriminator", label: "🔢 Discriminator" },
                { key: "avatar", label: "🖼️ Avatar" }
            ];

            userKeys.forEach(({ key, label }) => {
                if (oldMember.user[key] !== newMember.user[key]) {
                    changedprop.push({ key: label, old: oldMember.user[key], new: newMember.user[key] });
                }
            });

            let oldRoles = oldMember.roles.cache.map(role => role.name);
            let newRoles = newMember.roles.cache.map(role => role.name);

            oldRoles.forEach((role) => {
                if (!newRoles.includes(role)) {
                    changedprop.push({ key: "🏤 Ruolo rimosso", old: role, new: null });
                }
            });

            newRoles.forEach((role) => {
                if (!oldRoles.includes(role)) {
                    changedprop.push({ key: "🏤 Ruolo aggiunto", old: null, new: role });
                }
            });

            if (changedprop.length > 0)
                logmodule.guildMemberUpdate(newMember, changedprop, tag);


        }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });



    }
}
