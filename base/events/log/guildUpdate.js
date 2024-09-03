const { log } = require("../../../function/log/log");

module.exports = {
    name: "Log guildUpdate",
    typeEvent: "guildUpdate",
    allowevents: true,
    async execute(oldGuild, newGuild) {
        const tag = true;
        let logmodule = new log();

        try {
            await logmodule.init();

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

        } catch (error) {
            console.log("Errore nell'inizializzare il modulo log:", error);
        }
    }
}
