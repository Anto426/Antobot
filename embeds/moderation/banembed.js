const { EmbedBuilder } = require("discord.js")
const cembed = require("../../settings/embed.json")



async function banembeds(interaction, member, reason) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Utente bannato")
            .setDescription("<@" + member + ">" + " bannato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color.verde)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
    } catch { }
}

async function unbanmbeds(interaction) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Utente sbannato")
            .setDescription("Utente sbannato")
            .setThumbnail(null)
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch(err) {console.log(err) }
}

async function unbanmbede(interaction) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Utente gia sbannato")
            .setThumbnail(cembed.image.error)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed] })
    } catch(err) {console.log(err) }
}




module.exports = { banembeds, unbanmbeds, unbanmbede }