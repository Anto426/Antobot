const { EmbedBuilder } = require("discord.js")
const { inspect } = require(`util`)
const cembed = require("../../settings/embed.json")

function genericerr(interaction, err) {
    try {
        let frasi = ["Ops! Qualcosa è andato storto!!", "Riprova sarai più fortunato", "Ho riscrontrato alcuni errori durante l'esecuzione del comando"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(frasi[x].toString())
            .addFields(
                { name: 'Error:', value: `\`\`\`js\n${inspect((err.toString()))}\`\`\`` },
            )
            .setThumbnail(cembed.image.error)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (err1) { console.log(err1) }
}

function disablefunctionembed(interaction) {
    try {
        let frasi = ["Ci dispiace per l'inconveniente,ma la funzione è momentaneamente disabilitata"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Error")
            .setDescription(frasi[x])
            .setThumbnail(cembed.immage.err)
            .setColor(cembed.color.Red)
        interaction.reply({ embeds: [embed], ephemeral: true })
    } catch { }
}

module.exports = {
    genericerr,
    disablefunctionembed
}