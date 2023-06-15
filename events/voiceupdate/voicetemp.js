const { Stopiterval } = require("../../functions/iterval/interval")
const cguild = require("../../settings/guild.json")
module.exports = {
    name: "voiceStateUpdate",
    async execute(oldMember, newMember) {
        let category = newMember.guild.channels.cache.get(cguild["Anto's  Server"].channel.temp.id)
        let member = newMember.guild.members.cache.get(newMember.id)
        let channel = newMember.guild.channels.cache.find(x => x.parent == category && x.name == member.user.username)
        try {
            for (let x in cguild["Anto's  Server"].channel.temp.function) {
                if (newMember)
                    if (newMember.channel.id == cguild["Anto's  Server"].channel.temp.function[x].id) {
                        if (channel) {
                            channel.setUserLimit(cguild["Anto's  Server"].channel.temp.function[x].limite)
                            member.voice.setChannel(channel)
                            return
                        } else {

                            channel = await newMember.guild.channels.create({
                                name: member.user.username,
                                type: 2,
                                parent: category,
                                userLimit: cguild["Anto's  Server"].channel.temp.function[x].limite,

                            })
                            member.voice.setChannel(channel)
                            return
                        }
                    }
            }
        } catch (err) { }


        try {
            for (let x in cguild["Anto's  Server"].channel.temp.function) {
                if (newMember.channel != newMember.guild.channels.cache.find(y => y.id == cguild["Anto's  Server"].channel.temp.function[x].id) && oldMember.channel == channel) {
                    let intervalid = setInterval(async () => {
                        try {
                            if (channel.members.size == 0) {
                                channel.delete().catch(() => { Stopiterval(intervalid) })
                                Stopiterval(intervalid)
                            } else if (channel.members.has(oldMember.id))
                                Stopiterval(intervalid)
                        } catch (err) { console.log(err) }
                    }, 1000)
                    return
                }
            }
        } catch (err) { console.log(err) }

    }
}