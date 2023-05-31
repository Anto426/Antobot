const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../../settings/embed.json")
function offonmsgerr(interaction, type) {
    try {
        let frasion = ["Il bot è gia online"]
        let frasioff = ["il bot è gia offiline"]
        let string = []
        if (type) {
            string = frasion
        } else {
            string = frasioff
        }
        var x = Math.floor(Math.random() * string.length);
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(string[x].toString())
            .setThumbnail(cembed.immage.err)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed], ephemeral: true })
    } catch { }
}
function dmmessageerr(interaction) {
    try {
        let frasi = ["Non ho potuto contattarlo nei dm"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(frasi[x].toString())
            .setThumbnail(cembed.immage.err)
            .setColor(cembed.color.rosso)
        interaction.channel.send({ embeds: [embed] })
    } catch { }
}

module.exports = { offonmsgerr, dmmessageerr }