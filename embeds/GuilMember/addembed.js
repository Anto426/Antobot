const { EmbedBuilder, AttachmentBuilder } = require("discord.js")
const { createCanvas, loadImage, registerFont } = require("canvas")
const cguild = require("../../settings/guild.json")
const cembed = require("../../settings/embed.json")
const { sendtoalllog } = require("../../functions/log/sendtolog")


async function welcomeembed(member, count) {

    try {
        registerFont("./canavas/font/asapCondensed.ttf", { family: "asapCondensed" });
        registerFont("./canavas/font/NotoSansJP-Bold.ttf", { family: "NotoSansJP-Bold" });



        let canvas = await createCanvas(1700, 600)
        let ctx = await canvas.getContext("2d")
        let img = await loadImage("./canavas/image/background.jpg")
        ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2)
        ctx.fillStyle = "rgba(0,0,0,0.30)"
        ctx.fillRect(70, 70, canvas.width - 70 - 70, canvas.height - 70 - 70)

        ctx.save()
        ctx.beginPath()
        ctx.arc(150 + 300 / 2, canvas.height / 2, 150, 0, 2 * Math.PI, false)
        ctx.clip()
        img = await loadImage(member.displayAvatarURL({ format: "jpg" }).replace('.webp', '.png'))
        ctx.drawImage(img, 150, canvas.height / 2 - 300 / 2, 300, 300)
        ctx.restore()


        ctx.fillStyle = "#fff"
        ctx.textBaseline = "middle"

        ctx.font = "80px asapCondensed"
        ctx.fillText("Benvenuto", 500, 200)

        ctx.font = "100px asapCondensed", "100px NotoSansJP-Bold"
        ctx.fillText(member.user.username.slice(0, 25), 500, canvas.height / 2)

        ctx.font = "50px asapCondensed"
        ctx.fillText(`${count}° membro`, 500, 400)

        let attachment = new AttachmentBuilder(canvas1.toBuffer(), { name: "welcomecanavas.png" })


        const message = `
        ╚»★Benvenuto su ${member.guild.name}★«╝
${member} benvenuto su  ${member.guild.name} spero che ti possa trovare bene sei il nostro ${cout} memebro
        
        
        `
        client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).channels.cache.get(cguild["Anto's  Server"].channel.info.welcome).send(
            {
                content: message,
                files: [attachment],
            })

    } catch { }
}
async function logaddmember(member, cout) {

    try {
        const embed = new EmbedBuilder()
            .setTitle("Nuovo Utente")
            .addFields(
                { name: ":bust_in_silhouette: NAME", value: `\`\`\`\n${member.user.tag}\n\`\`\`` },
                { name: ":id: ID", value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: ":timer: ORA ", value: `\`\`\`\n${new Date().toLocaleString('it-IT', optionsdate)}\n\`\`\`` },
                { name: ":1234: MEMBRO", value: `\`\`\`\n${cout} membro\`\`\`` }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }) || cembed.image.notimmage)
            .setColor(cembed.color.verde)
        sendtoalllog({ embeds: [embed], })

    } catch { }
}

async function logaddmembernotv(member) {

    try {
        const embed = new EmbedBuilder()
            .setTitle("Nuovo Utente Non Verificato")
            .addFields(
                { name: ":bust_in_silhouette: NAME", value: `\`\`\`\n${member.user.tag}\n\`\`\`` },
                { name: ":id: ID", value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: ":timer: ORA ", value: `\`\`\`\n${new Date().toLocaleString('it-IT', optionsdate)}\n\`\`\`` },
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }) || cembed.image.notimmage)
            .setColor(cembed.color.verde)
        sendtoalllog({ embeds: [embed], })

    } catch { }
}
module.exports = {
    welcomeembed,
    logaddmember,
    logaddmembernotv
}