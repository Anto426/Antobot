const cguild = require("../../settings/guild.json")
module.exports = {
    name: "voiceStateUpdate",
    async execute(oldMember, newMember) {
        let category = newMember.guild.channels.cache.get(cguild[oldMember.guild.name].channel.temp.id)
        let member = newMember.guild.members.cache.get(newMember.id)
        let channel = newMember.guild.channels.cache.find(x => x.parent == category && x.name == member.user.username)
        try {


            for (let x in cguild["Anto's  Server"].channel.temp.function) {
                if (newMember.channel.id == cguild["Anto's  Server"].channel.temp.function[x].id) {
                    if (channel) {
                        channel.setUserLimit(cguild["Anto's  Server"].channel.temp.function[x].limite)
                        member.voice.setChannel(channel)
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
            if (newMember.channel == null) {
                if (oldMember.channel == channel) {
                    channel.delete()
                }
            }
        } catch (err) { }



    }
}