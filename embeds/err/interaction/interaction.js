const { EmbedBuilder } = require("discord.js")
const cembed = require("../../../settings/embed.json")


function notyourbootn(interaction) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Non è il tuo bootone questo")
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.image.error)
        interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (err) { console.log(err) }
}

module.exports = {
    notyourbootn
}