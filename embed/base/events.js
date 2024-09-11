const { AttachmentBuilder } = require("discord.js");
const { BaseEmbed } = require("../baseembed");
const { createCanvas, loadImage, registerFont } = require("canvas")
const setting = require("./../../setting/settings.json")
class EventEmbed extends BaseEmbed {
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

                registerFont(process.env.dirbot + setting.canavas.font.dir + "/" + setting.canavas.font.name[0], { family: setting.canavas.font.name[0].split(".")[0] });
                registerFont(process.env.dirbot + setting.canavas.font.dir + "/" + setting.canavas.font.name[1], { family: setting.canavas.font.name[1].split(".")[0] });


                let canvas = await createCanvas(1700, 600)
                let ctx = await canvas.getContext("2d")
                let img = await loadImage(process.env.dirbot + setting.canavas.image.dir + "/" + setting.canavas.image.name[0])
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


                this.embed
                    .setTitle(`╚»★Benvenuto su ${member.guild.name}★«╝`)
                    .setDescription(`${member} benvenuto su  ${member.guild.name} spero che ti possa trovare bene sei il nostro ${count} membro `)
                    .setImage('attachment://welcomecanavas.png')

                let send = [this.embed, attachment]

                resolve(send)

            } catch (err) {
                console.log(err)
                reject(-1)
            }

        })

    }

    welcomeback(member, list) {
        let serverIcon = member.guild.iconURL();
        let string = list.reverse().join('\n').toString()
        return this.embed
            .setTitle(`╚»★Bentornato su ${member.guild.name}★«╝`)
            .setDescription(`${member} Bentornato su  ${member.guild.name} `)
            .addFields({
                name: "Ruoli ricevuti",
                value: string,
            })
            .setThumbnail(serverIcon)


    }

    boostEvent(member) {
        return this.embed
            .setTitle("🚀 Nuovo boost")
            .setDescription(`🎉 ${member.user} ha boostato il server`)
            .addFields(
                {
                    name: "🚀 Livello Server",
                    value: member.guild.premiumTier.toString(),
                    inline: true
                },
                {
                    name: "🔢 Numero boost",
                    value: member.guild.premiumSubscriptionCount.toString(),
                    inline: true
                }

            )
            .setThumbnail(embedconfig.image.boost)
            .setColor(embedconfig.color.purple)
    }


    holiday(holiday) {
        return this.embed
            .setTitle(holiday.title)
            .setDescription(`@everyone\n@here\n${holiday.message}`)
            .setColor(holiday.color)
            .setThumbnail(holiday.image)
    }


}

module.exports = { EventEmbed }