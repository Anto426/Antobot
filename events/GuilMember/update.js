const { boostembed } = require("../../embeds/boost/boostembed")

module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember) {
        try {
            if (!oldMember.premiumSice && newMember.premiumSice)
                boostembed(newMember)
        } catch (err) { console.log(err) }
    }
}