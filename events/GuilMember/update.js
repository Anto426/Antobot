const { boostembed } = require("../../embeds/boost/boostembed")


module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        try {
            if (oldMember.premiumSince == null && newMember.premiumSince != null)
                boostembed(newMember)
        } catch (err) { console.log(err) }
    }
}
