const { logleftmember } = require("../../embeds/GuilMember/leftembed")

module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
        try {
            logleftmember(member)
        } catch (err) { console.log(err) }
    }
}