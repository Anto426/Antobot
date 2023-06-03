const cguild = require("../../settings/guild.json")
module.exports = {
    name: "voiceStateUpdate",
    async execute(oldMember, newMember) {
        let category = newMember.guild.channels.cache.get(cguild["Anto's  Server"].channel.temp.id)
        let member = newMember.guild.members.cache.get(newMember.id)
        let channel = newMember.guild.channels.cache.find(x => x.parent == category && x.name == member.user.username)
        try {
            for (let x in cguild["Anto's  Server"].channel.temp.function) {
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

        for (let x in cguild["Anto's  Server"].channel.temp.function) {

            if (newMember.channel == null || newMember.channel.id != cguild["Anto's  Server"].channel.temp.function[x].id) {
                if (newMember.channel != oldMember.channel && oldMember.channel == channel.id) {
                    if (oldMember.channel == channel) {
                        const intervalId = setInterval(async () => {
                            if (channel.members.size == 0) {
                                channel.delete()
                                clearInterval(intervalId);
                            }
                            if (channel.members.has(oldMember.id))
                                clearInterval(intervalId);
                        }, 1000 * 5 * 60);
                    }
                    return
                }
            }
        }

    }
}