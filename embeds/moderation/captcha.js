const { EmbedBuilder } = require("discord.js")
const cembed = require("../../settings/embed.json")



async function captchastartembed(member, capcha, row, channel) {

    try {
        let embed = new EmbedBuilder()
            .setTitle("Verifica")
            .setDescription(`${member} per entrare nel  server dovrai risolvere questo captcha quando sei proto clicca su pulsante qui in basso`)
            .setColor(cembed.color.viola)
            .setThumbnail(channel.guild.iconURL({ dynamic: true }) || cembed.image.notimmage)
            .setImage('attachment://captcha.png')

        channel.send({ embeds: [embed], files: [capcha], components: [row] })


    } catch { }
}



async function captchaembed(member, row, interaction) {

    try {

        let embed = new EmbedBuilder()
            .setTitle("Captcha")
            .setDescription(`${member} capcha iniziato`)
            .setColor(cembed.color.viola)
            .setThumbnail(cembed.image.loading)

        interaction.reply({ embeds: [embed], components: [row] })


    } catch { }
}


async function captchaembedsucc(member, interaction) {

    try {
        let embed = new EmbedBuilder()
            .setTitle(`${member.user.tag} verificato`)
            .setDescription("verifica completata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
            .setColor(cembed.color.verde)
            .setThumbnail(cembed.image.verifs)

        interaction.reply({ embeds: [embed] })


    } catch (err) { }
}

async function captchaembednotv(member, channel) {

    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`${member.user.tag} verificato Ci dispiace che non sei riuscito a verificarti, ma ora dovro kickarti`)
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.image.error)

        channel.send({ embeds: [embed] })
    } catch { }
}

async function captchadelbackup(channel, row) {

    try {
        let embed = new EmbedBuilder()
            .setTitle("Posso cancellare la chat?")
            .setDescription("Posso cancellare la chat ?")
            .setColor(cembed.color.giallo)
            .setThumbnail(cembed.image.error)
        channel.send({ embeds: [embed], components: [row] })

    } catch { }
}


module.exports = { captchastartembed, captchaembed, captchaembedsucc, captchaembednotv, captchadelbackup }



