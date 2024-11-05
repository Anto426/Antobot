const { log } = require("../../../function/log/log");

module.exports = {
    name: "Log guildUpdate",
    typeEvent: "guildUpdate",
    allowevents: true,
    async execute(oldGuild, newGuild) {

        return new Promise((resolve, reject) => {
            const tag = false;
            let logmodule = new log();

            logmodule.init().then(() => {
                let changedprop = [];
                const keys = [
                    { key: "name", label: "📛 Name" },
                    { key: "region", label: "🌍 Region" },
                    { key: "verificationLevel", label: "✅ Verification Level" },
                    { key: "afkChannelID", label: "💤 AFK Channel" },
                    { key: "afkTimeout", label: "⏲️ AFK Timeout" },
                    { key: "icon", label: "🖼️ Icon" },
                    { key: "splash", label: "🌊 Splash" },
                    { key: "banner", label: "🎨 Banner" },
                    { key: "systemChannelID", label: "📢 System Channel" },
                    { key: "preferredLocale", label: "🌐 Preferred Locale" }
                ];

                keys.forEach(({ key, label }) => {
                    if (oldGuild[key] !== newGuild[key]) {
                        changedprop.push({ key: label, old: oldGuild[key], new: newGuild[key] });
                    }
                });

                if (changedprop.length > 0)
                    logmodule.guildUpdate(newGuild, changedprop, tag);

            }).catch(() => { console.log("Errore nell'inizializzare il modulo log") });
        });

    }
}
