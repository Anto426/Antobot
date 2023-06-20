
const { genericerr } = require("../../embeds/err/generic");
const { banembeds, unbanmbeds, unbanmbede } = require("../../embeds/moderation/banembed");

async function banf(interaction, member, reason) {
    try {
        banembeds(interaction, member, reason)
        member.ban({
            reason: reason
        });

    } catch (err) {
        genericerr(interaction, err)
    }
}


async function unbanf(interaction, id) {
    let a = true
    try {
        interaction.guild.bans.fetch().then(banned => {
            banned.forEach(element => {
                if (element.user.id.toString() == id)
                    a = false
            })
        }).then(x => {

            if (!a) {
                unbanmbeds(interaction)
                interaction.guild.members.unban(id)
            } else {
                unbanmbede(interaction)
            }
        })
        return
    } catch {
        genericerr(interaction, err)
    }
}

module.exports = {
    banf,
    unbanf,


}