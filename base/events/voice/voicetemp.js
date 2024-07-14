const { Cjson } = require("../../../function/file/json");
const { BotConsole } = require("../../../function/log/botConsole");

const setting = require("../../../setting/settings.json")
module.exports = {
    name: "voicestateupdate",
    typeEvent: "voiceStateUpdate",
    async execute(oldMember, newMember) {
        if (!newMember.member.user.bot) {
            let json = new Cjson;
            await json.jsonDependencyBufferOnly(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then(async (jsonGuild) => {
                let category = newMember.guild.channels.cache.get(jsonGuild["Anto's Server"].channel.temp.id);
                let member = newMember.guild.members.cache.get(newMember.id);
                let channel = newMember.guild.channels.cache.find(x => x.parent == category && x.name == member.user.globalName.toString());

                if (!category && !member && !channel) return;
                try {
                    for (let x in jsonGuild["Anto's Server"].channel.temp.function) {
                        if (newMember)
                            if (newMember.channel.id == jsonGuild["Anto's Server"].channel.temp.function[x].id) {
                                if (channel) {
                                    channel.setUserLimit(jsonGuild["Anto's Server"].channel.temp.function[x].limite);
                                    member.voice.setChannel(channel);
                                    return;
                                } else {
                                    channel = await newMember.guild.channels.create({
                                        name: member.user.globalName.toString(),
                                        type: 2,
                                        parent: category,
                                        userLimit: jsonGuild["Anto's Server"].channel.temp.function[x].limite,
                                    });
                                    member.voice.setChannel(channel);
                                    return;
                                }
                            }
                    }
                } catch (err) { }

                try {
                    for (let x in jsonGuild["Anto's Server"].channel.temp.function) {
                        if (newMember.channel != newMember.guild.channels.cache.find(y => y.id == jsonGuild["Anto's Server"].channel.temp.function[x].id) && oldMember.channel == channel) {
                            let intervalId = setInterval(async () => {
                                try {
                                    if (channel.members.size == 0) {
                                        channel.delete().catch(() => { });
                                        clearInterval(intervalId);
                                        return;
                                    } else if (channel.members.has(oldMember.id))
                                        clearInterval(intervalId);
                                } catch (err) { if (channel) return clearInterval(intervalId); }
                            }, 1000 * 60 * 5);
                        }
                    }
                } catch (err) { console.log(err); }
            }).catch((err) => { new BotConsole().log(err); new BotConsole().log("Non ho potuto creare il canale temporaneo", "red"); });
        }
    }
}