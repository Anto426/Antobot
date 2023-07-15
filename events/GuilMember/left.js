const { logleftmember } = require("../../embeds/GuilMember/leftembed")

module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
        try {
            let channel = member.guild.channels.cache.find(x => x.name == `—͟͞͞🔍】 ${member.user.tag}`)
            if (channel)
                channel.delete().catch(() => { })
            logleftmember(member)
        } catch (err) { console.log(err) }
    }
}