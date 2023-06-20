const { kickembeds } = require("../../embeds/moderation/kickembed");

async function kickf(interaction, member, reason) {
    try {
        member.kick();
        kickembeds(interaction, member, reason)
    } catch (err) {
        console.error(err)
        errmsg.genericmsg(interaction)
    }


}

module.exports = {
    kickf,

}