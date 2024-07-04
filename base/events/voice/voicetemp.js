const { Cjson } = require("../../../function/file/json");
const { consolelog } = require("../../../function/log/consolelog");
const setting = require("../../../setting/settings.json")
module.exports = {
    name: "voicestateupdate",
    typeEvent: "voiceStateUpdate",
    async execute(oldMember, newMember) {

        let json = new Cjson;

        await json.jsonddypendencebufferolyf(setting.configjson.online.url + "/" + setting.configjson.online.name[2], process.env.GITTOKEN).then(async (jsonguild) => {
            let category = newMember.guild.channels.cache.get(jsonguild["Anto's  Server"].channel.temp.id)
            let member = newMember.guild.members.cache.get(newMember.id)

            let channel = newMember.guild.channels.cache.find(x => x.parent == category && x.name == member.user.globalName.toString())

            if (!category && !member && !channel) return
            try {
                for (let x in jsonguild["Anto's  Server"].channel.temp.function) {
                    if (newMember)
                        if (newMember.channel.id == jsonguild["Anto's  Server"].channel.temp.function[x].id) {
                            if (channel) {
                                channel.setUserLimit(jsonguild["Anto's  Server"].channel.temp.function[x].limite)
                                member.voice.setChannel(channel)
                                return
                            } else {

                                channel = await newMember.guild.channels.create({
                                    name: member.user.globalName.toString(),
                                    type: 2,
                                    parent: category,
                                    userLimit: jsonguild["Anto's  Server"].channel.temp.function[x].limite,

                                })
                                member.voice.setChannel(channel)
                                return
                            }
                        }
                }
            } catch (err) { }


            try {
                for (let x in jsonguild["Anto's  Server"].channel.temp.function) {
                    if (newMember.channel != newMember.guild.channels.cache.find(y => y.id == jsonguild["Anto's  Server"].channel.temp.function[x].id) && oldMember.channel == channel) {
                        let intervalid = setInterval(async () => {
                            try {
                                if (channel.members.size == 0) {
                                    channel.delete().catch(() => { })
                                    clearInterval(intervalid)
                                    return
                                } else if (channel.members.has(oldMember.id))
                                    clearInterval(intervalid)
                            } catch (err) { if (channel) return clearInterval(intervalid) }
                        }, 1000 * 60 * 5)
                    }
                }
            } catch (err) { console.log(err) }


        }).catch(() => { consolelog("Non ho potuto creare il canale temporaneo", "red") })



    }
}