const { botmsgerr } = require("../../embeds/err/command/permission");
const { genericerr } = require("../../embeds/err/generic");
const { mutembede, mutembeds } = require("../../embeds/moderation/muteembed");

async function mutef(interaction, member, reason) {
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
        mutembede(interaction)

    } else {
        member.roles.add(muted).catch(() => {
            genericerr(interaction)
            return
        })
        mutembeds(interaction)
    }



}

async function unmutef(interaction, member) {
    if (member.user.bot) {
        errmsg.bot(interaction)
        return interaction.reply({ embeds: [embed] })

    }

    let muted = interaction.guild.roles.cache.find(x => x.name == "MutedA")


    if (!member.roles.cache.has(muted.id)) {
    }
}


module.exports = {
    mutef,
    unmutef

}