const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../../settings/embed.json")
function tohigtmsgerr(interaction) {
    try {
        let frasi = ["Il ragazzo è troppo forte", "Ha un ruolo più alto del tuo"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(frasi[x].toString())
            .setThumbnail(cembed.immage.err)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed], ephemeral: true })
    } catch { }
}
function notpermisionmsgerr(interaction) {
    try {
        let frasi = ["Non hai il permesso per usare questo commando o non puoi eseguirlo in questa chat"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(frasi[x].toString())
            .setThumbnail(cembed.immage.err)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed], ephemeral: true })
    } catch { }
}
function botmsgerr(interaction) {
    try {
        let frasi = ["Hey non posso applicare questa azione agli altri bot"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(frasi[x].toString())
            .setThumbnail(cembed.immage.err)
            .setColor(cembed.color.rosso)
        interaction.channel.send({ embeds: [embed], ephemeral: true })
    } catch { }
}

module.exports = {
    tohigtmsgerr,
    notpermisionmsgerr,
    botmsgerr


}