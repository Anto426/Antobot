const { log } = require("../../../function/log/log");

module.exports = {
    name: "Log channelUpdate",
    typeEvent: "channelUpdate",
    allowevents: true,
    async execute(oldChannel, newChannel) {
        const tag = true;
        let logmodule = new log();

        try {
            await logmodule.init();

            let changedprop = [];
            let keys = [
                { key: "name", label: "📛 name" },
                { key: "position", label: "📍 position" },
                { key: "topic", label: "📝 topic" },
                { key: "nsfw", label: "🔞 nsfw" },
                { key: "rateLimitPerUser", label: "⏱️ slowmode" },
            ];

            keys.forEach(({ key, label }) => {
                if (oldChannel[key] !== newChannel[key]) {
                    changedprop.push({ key: label, old: oldChannel[key], new: newChannel[key] });
                }
            });

            if (changedprop.length > 0)
                logmodule.updatechannel(newChannel, changedprop, tag);

        } catch (error) {
            console.log("Errore nell'inizializzare il modulo log:", error);
        }
    }
}