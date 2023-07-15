const { botmsgerr } = require("../../embeds/err/command/permission");
const { genericerr } = require("../../embeds/err/generic");
const { mutembede, mutembeds, unmutembede, unmutembeds } = require("../../embeds/moderation/muteembed");

async function mutef(interaction, member, reason) {


    try {
        if (member.user.bot) {
            botmsgerr(interaction)
        }
        let muted = interaction.guild.roles.cache.find(x => x.name == "MutedA")
        if (!muted) {
            muted = await interaction.guild.roles.create({
                name: "MutedA",
                permissions: [""]
            })
            interaction.guild.channels.cache.forEach(channel => {
                channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false })
            });
        }
        if (member.roles.cache.has(muted.id)) {
            mutembede(interaction, member)

        } else {
            member.roles.add(muted).catch(() => {
                genericerr(interaction)
                return
            })
            mutembeds(interaction, member, reason)
        }
    } catch (err) { genericerr(interaction, err) }





}

async function unmutef(interaction, member) {

    try {
        if (member.user.bot) {
            return botmsgerr(interaction)
        }

        let muted = interaction.guild.roles.cache.find(x => x.name == "MutedA")


        if (!member.roles.cache.has(muted.id)) {
            unmutembede(interaction, member)
        } else {
            member.roles.remove(muted).catch(() => { errmsg.genericmsg(interaction) })
            unmutembeds(interaction, member)
        }
    } catch (err) { genericerr(interaction, err) }

}


module.exports = {
    mutef,
    unmutef

}