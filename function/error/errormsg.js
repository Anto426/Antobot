const configs = require("./../../index")
function msggeneric(interaction) {
    let frasi = ["Ops! Qualcosa è andato storto!!", "Riprova sarai più fortunato", "Ho riscrontrato alcuni errori durante l'esecuzione del comando", "Mannaggia a quel preservativo bucato da cui sei nato porcodidido cambia lavoro fatti na vita e spoarati nell'ano porcodidido"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new configs.Discord.EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x].toString())
        .setThumbnail(configs.settings.embed.images.error)
        .setColor(configs.settings.embed.color.red)
    interaction.reply({ embeds: [embed] })
}

function msghigtlivel(interaction) {




}

module.exports = {
    message: msggeneric
}