const { AttachmentBuilder } = require("discord.js");
const { baseembed } = require("../baseembed");
const { createCanvas, loadImage, registerFont } = require("canvas")
class eventbembed extends baseembed {
    constructor(guild, member) {
        super(guild, member)
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; this.embed.setColor(embedconfig.color.green); resolve(0) }).catch(() => { reject(-1) })
        })
    }

    welcome(member, count) {

        return new Promise(async (resolve, reject) => {
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

                let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "welcomecanavas.png" })

                let send = [this.embed
                    .setTitle(`╚»★Benvenuto su ${member.guild.name}★«╝`)
                    .setDescription(`${member} benvenuto su  ${member.guild.name} spero che ti possa trovare bene sei il nostro ${count} membro `)
                    .setImage('attachment://welcomecanavas.png'), attachment]

                resolve(send)

            } catch (err) {
                console.log(err)
                reject(-1)
            }

        })

    }



}

module.exports = { eventbembed }