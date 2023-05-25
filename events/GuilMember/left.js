const { logleftmember } = require("../../embeds/GuilMember/left")

module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
        try {
            logleftmember(member)
        } catch (err) { console.log(err) }
    }
}