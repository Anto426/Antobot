const { EmbedBuilder } = require("discord.js")
const cembed = require("../../settings/embed.json")
const { sendtoalllog } = require("../../functions/log/sendtolog")


async function captchastartembed(member, capcha, row, channel) {

    try {
        let embed = new Discord.MessageEmbed()
            .setTitle("Verifica il captcha")
            .setDescription(member.user.tag + " per entrare nel  server dovrai risolvere questo captcha quando sei proto clicca su questo pulsante")
            .setColor(cembed.color.rosso)
            .setImage('attachment://captcha.png')
            .setColor(cembed.color.rosso)

            channel.send({ embeds: [embed], files: [capcha], components: [row] })


    } catch { }
}



async function captchaembed(member, row, channel) {

    try {

        channel.messages.fetch({ limit: 5 }).then(messages => {
            const botMessages = messages.filter(msg => msg.author.bot && msg.author.id === client.user.id);
            const lastBotMessage = botMessages.first();

            let embed = new Discord.MessageEmbed()
                .setTitle("Verifica il captcha")
                .setDescription(member.user.tag + " capcha iniziato")
                .setColor(cembed.color.rosso)
                (cembed.image.error)
                .setColor(cembed.color.rosso)

                lastBotMessage.reply({ embeds: [embed], components: [row] })


        })







    } catch { }
}

async function capchaerrorembed(member, channel) {

    try {
        let embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription("Impossibile verificarti controlla di aver scritto bene il captcha !! Riprova!")
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.image.error)


    } catch { }
}

async function captchaembed(member, channel) {

    try {
        let embed = new Discord.MessageEmbed()
            .setTitle(member.user.tag + " verificato")
            .setDescription("verifica completata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.image.error)



    } catch { }
}

async function captchaembed(member, channel) {

    try {
        let embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription("Ci dispiace che non sei riuscito a verificarti, ma ora dovro kickarti")
            .setColor(cembed.color.rosso)
            .setThumbnail(cembed.image.error)

    } catch { }
}

async function captchaembed(member, channel) {

    try {
        let embed = new Discord.MessageEmbed()
            .setTitle("Posso cancellare la chat?")
            .setDescription("Posso cancellare la chat ?")
            .setColor(cembed.color.giallo)
            .setThumbnail(cembed.image.error)


    } catch { }
}


module.exports = { captchastartembed }









module.exports = {
    captchaembed, capchaerrorembed, captchasuccesembed, captchafalliedembed, messagebackupdeleteembed
}

