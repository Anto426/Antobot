const { EmbedBuilder } = require("discord.js")
const cembed = require("../../settings/embed.json")


async function mutembeds(interaction, member, reason) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Utente mutato")
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + member + ">" + " mutato")
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch { }
}


async function mutembede(interaction, member) {
    try {
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(member.user.tag + " risulta già mutato")
            .setThumbnail(cembed.image.error)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed], ephemeral: true })
    } catch { }
}





async function unmutembeds(interaction, member) {
    try {
        const embed = new EmbedBuilder()
            .setTitle("Utente smutato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + member + ">" + " smutato")
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })

    } catch { }
}


async function unmutembede(interaction) {
    try {
        const embed = new EmbedBuilder()
            .setTitle(interaction.member.user.tag + " Error")
            .setDescription(member.user.tag + " risulta già smutato")
            .setThumbnail(cembed.image.error)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed] })
    } catch { }
}




module.exports = { mutembeds, mutembede, unmutembeds, unmutembede }