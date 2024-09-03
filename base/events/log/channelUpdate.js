const { Cjson } = require("../../../function/file/json");
const { log } = require("../../../function/log/log");
const setting = require("./../../../setting/settings.json")
module.exports = {
    name: "Log channelUpdate",
    typeEvent: "channelUpdate",
    allowevents: true,
    async execute(oldChannel, newChannel) {
        const tag = false;
        let logmodule = new log();
        let json = new Cjson();


        await logmodule.init().then(() => {

            json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then((data) => {

                let changedprop = [];
                let keys = [
                    { key: "name", label: "📛 name" },
                    { key: "position", label: "📍 position" },
                    { key: "topic", label: "📝 topic" },
                    { key: "nsfw", label: "🔞 nsfw" },
                    { key: "rateLimitPerUser", label: "⏱️ slowmode" },
                    { key: "parentID", label: "🔗 parentID" },
                    { key: "bit", label: "🔒 permissionOverwrites" },
                    { key: "bitrate", label: "🔊 bitrate" }

                ];

                keys.forEach(({ key, label }) => {
                    if (oldChannel[key] !== newChannel[key]) {
                        changedprop.push({ key: label, old: oldChannel[key], new: newChannel[key] });
                    }
                });

                if (changedprop.length > 0 && newChannel.parentId !== data[newChannel.guild.name].channel.hollyday.id)
                    logmodule.updatechannel(newChannel, changedprop, tag);

            }).catch((err) => { console.log(err) });


        }).catch(() => { console.log("Errore nell'inizializzare il modulo log:", error); });


    }
}