const { EmbedBuilder } = require("discord.js")
const { inspect } = require(`util`)
const cembed = require("./../../settings/embed.json")

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
function tohigtmsg(interaction) {
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
function notpermisionmsg(interaction) {
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

function offonmsg(interaction, type) {
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
function dmmessage(interaction) {
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
function botmsg(interaction) {
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


function disablefunction(interaction) {
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
function vocalchannel(interaction) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Devi essere in un canale vocale")
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.immage.err)
        interaction.reply({ embeds: [embed] })
    } catch { }
}
function listvoid(interaction) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("La lista delle canzoni è vuota!")
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.immage.err)
        interaction.reply({ embeds: [embed] })
    } catch { }
}
function anotheplay() {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Qualcuno sta ascoltando già della musica")
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.immage.err)
        interaction.reply({ embeds: [embed] })
    } catch { }
}

function notyourbootn() {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Non è il tuo bootone questo")
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.immage.err)
        interaction.reply({ embeds: [embed] })
    } catch { }
}

module.exports = {
    genericerr,
    tohigtmsg,
    notpermisionmsg,
    offonmsg,
    dmmessage,
    botmsg,
    disablefunction,
    vocalchannel,
    listvoid,
    anotheplay,
    notyourbootn
}