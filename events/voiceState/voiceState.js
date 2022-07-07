module.exports = {
    name: "voiceStateUpdate",
    async execute(oldMember, newMember) {

        let category = newMember.guild.channels.cache.find(x => x.name.includes("TEMPORANEE"))
        let member = newMember.guild.members.cache.get(newMember.id)
        let channel = newMember.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.parent == category && x.name == member.user.username)
        try {


            for (let x in configs[newMember.guild.name].stanze.temporanne) {
                if (newMember.channel.id == configs[newMember.guild.name].stanze.temporanne[x].id) {
                    if (channel) {
                        channel.setUserLimit(configs[newMember.guild.name].stanze.temporanne[x].limit)
                        member.voice.setChannel(channel)
                    } else {
                        let channel = await newMember.guild.channels.create(member.user.username, {
                            type: 'GUILD_VOICE',
                            parent: category,
                            userLimit: configs[newMember.guild.name].stanze.temporanne[x].limit,

                        })
                        member.voice.setChannel(channel)
                        return
                    }
                }

            }


        } catch (err) {}



        if (newMember.channel == null) {
            if (oldMember.channel == channel) {
                channel.delete()
            }
        }




    }
}