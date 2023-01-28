const cembed = require("./../../setting/embed.json")
const { EmbedBuilder } = require("discord.js")
function genericmsg(interaction) {
    let frasi = ["Ops! Qualcosa è andato storto!!", "Riprova sarai più fortunato", "Ho riscrontrato alcuni errori durante l'esecuzione del comando"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x].toString())
        .setThumbnail(cembed.immage.err)
        .setColor(cembed.color.Red)
    interaction.reply({ embeds: [embed], ephemeral: true })
}

function tohigtmsg(interaction) {
    let frasi = ["Il ragazzo è troppo forte", "Ha un ruolo più alto del tuo"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x].toString())
        .setThumbnail(cembed.immage.err)
        .setColor(cembed.color.Red)
    interaction.reply({ embeds: [embed], ephemeral: true })

}
function notpermisionmsg(interaction) {
    let frasi = ["Non hai il permesso per usare questo commando o non puoi eseguirlo in questa chat"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x].toString())
        .setThumbnail(cembed.immage.err)
        .setColor(cembed.color.Red)
    interaction.reply({ embeds: [embed], ephemeral: true })

}

function offonmsg(interaction, type) {
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
        .setColor(cembed.color.Red)
    interaction.reply({ embeds: [embed], ephemeral: true })

}
function dmmessage(interaction) {
    let frasi = ["Non ho potuto contattarlo nei dm"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x].toString())
        .setThumbnail(cembed.immage.err)
        .setColor(configs.settings.embed.color.red)
    interaction.channel.send({ embeds: [embed] })

}
function botmsg(interaction) {
    let frasi = ["Hey non posso applicare questa azione agli altri bot"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x].toString())
        .setThumbnail(cembed.immage.err)
        .setColor(cembed.color.Red)
    interaction.channel.send({ embeds: [embed], ephemeral: true })

}


function disablefunction(interaction) {
    let frasi = ["Ci dispiace per l'inconveniente,ma la funzione è momentaneamente disabilitata"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new configs.Discord.EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x])
        .setThumbnail(cembed.immage.err)
        .setColor(cembed.color.Red)
    interaction.reply({ embeds: [embed], ephemeral: true })

}
function vocalchannel(interaction) {
    let embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Devi essere in un canale vocale")
        .setColor(cembed.color.Red)
        .setThumbnail(cembed.immage.err)
    interaction.reply({ embeds: [embed] })
}
function listvoid(interaction) {
    let embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("La lista delle canzoni è vuota!")
        .setColor(cembed.color.Red)
        .setThumbnail(cembed.immage.err)
    interaction.reply({ embeds: [embed] })
}
function anotheplay() {
    let embed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("Qualcuno sta ascoltando già della musica")
        .setColor(cembed.color.Red)
        .setThumbnail(cembed.immage.err)
    interaction.reply({ embeds: [embed] })
}

module.exports = {
    genericmsg,
    tohigtmsg,
    notpermisionmsg,
    offonmsg,
    dmmessage,
    botmsg,
    disablefunction,
    vocalchannel,
    listvoid,
    anotheplay
}