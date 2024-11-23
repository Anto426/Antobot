const { AttachmentBuilder } = require("discord.js");
const { BaseEmbed } = require("../baseembed");
const { DynamicColor } = require("../../function/Color/DynamicColor");
const { createCanvas, loadImage, registerFont } = require("canvas")
const setting = require("./../../setting/settings.json");
class EventEmbed extends BaseEmbed {
    constructor(guild, member, image) {
        super(guild, member, image)
    }

    init() {
        return new Promise((resolve, reject) => {
            super.init().then((embed) => { this.embed = embed; resolve(0) }).catch(() => { reject(-1) })
        })
    }

    welcome(member, count) {


        return new Promise(async (resolve, reject) => {
            try {
                registerFont(process.env.dirbot + setting.canavas.font.dir + "/" + setting.canavas.font.name[0], { family: setting.canavas.font.name[0].split(".")[0] });
                registerFont(process.env.dirbot + setting.canavas.font.dir + "/" + setting.canavas.font.name[1], { family: setting.canavas.font.name[1].split(".")[0] })

                let dynamicColor = new DynamicColor()
                let ColorFunctions = dynamicColor.ColorFunctions
                let canvas = createCanvas(1700, 600)
                let ctx = canvas.getContext("2d")
                let Numcolor = 3;
                let distancecoloror = canvas.width / Numcolor;
                let position = 0;

                await dynamicColor.setImgUrl(member.displayAvatarURL()).catch((err) => { console.log(err); reject(-1) })
                dynamicColor.setNumcolorextract(Numcolor)
                let PalletandText = await dynamicColor.ReturnPalletandTextColor().catch((err) => { console.log(err); reject(-1) })
                let canvasGradient = ctx.createLinearGradient(0, canvas.height, canvas.width, canvas.height);

                console.log(PalletandText)

                PalletandText.palette.forEach((color, index) => {
                    position = index * distancecoloror;
                    canvasGradient.addColorStop(position, dynamicColor.ColorFunctions.ArrayToRgb(color));
                });

                ctx.fillStyle = canvasGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.save()
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                let radius = 50;
                const startX = 90;
                const startY = 90;
                const width = canvas.width - (startX * 2);
                const height = canvas.height - (startY * 2);
                ctx.beginPath();
                ctx.moveTo(startX + radius, startY);
                ctx.lineTo(startX + width - radius, startY);
                ctx.quadraticCurveTo(startX + width, startY, startX + width, startY + radius);
                ctx.lineTo(startX + width, startY + height - radius);
                ctx.quadraticCurveTo(startX + width, startY + height, startX + width - radius, startY + height);
                ctx.lineTo(startX + radius, startY + height);
                ctx.quadraticCurveTo(startX, startY + height, startX, startY + height - radius);
                ctx.lineTo(startX, startY + radius);
                ctx.quadraticCurveTo(startX, startY, startX + radius, startY);
                ctx.closePath();
                ctx.fill();
                ctx.save();
                ctx.beginPath();
                let img = await loadImage(member.displayAvatarURL({ format: "jpg" }).replace('.webp', '.png'));
                ctx.arc(150 + 300 / 2, canvas.height / 2, 150, 0, 2 * Math.PI, false);
                ctx.clip();
                ctx.drawImage(img, 150, canvas.height / 2 - 300 / 2, 300, 300);
                ctx.restore();
                ctx.lineWidth = 5;
                ctx.strokeStyle = ColorFunctions.ArrayToRgb(PalletandText.textColor);
                ctx.beginPath();
                ctx.arc(150 + 300 / 2, canvas.height / 2, 150, 0, 2 * Math.PI, false); // Disegna il cerchio
                ctx.stroke();
                ctx.fillStyle = ColorFunctions.ArrayToRgb(PalletandText.textColor);
                ctx.textBaseline = "middle"
                ctx.font = "80px asapCondensed"
                ctx.fillText("Benvenuto", 500, 200)
                ctx.font = "100px asapCondensed", "100px NotoSansJP-Bold"
                ctx.fillText((member.user.globalName ? member.user.globalName : member.user.username).slice(0, 25), 500, canvas.height / 2)
                ctx.font = "50px asapCondensed"
                ctx.fillText(`${count}° membro`, 500, 400)
                let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "welcomecanavas.png" })

                this.embed
                    .setTitle("👋 Benvenuto")
                    .setDescription(`🎉 ${member.user} benvenuto su ${this.guild} sei il ${count}° membro`)
                    .setImage('attachment://welcomecanavas.png')
                    .setColor(ColorFunctions.rgbToHex(PalletandText.textColor[0], PalletandText.textColor[1], PalletandText.textColor[2]))

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
        let string = list.reverse().join('\n').toString();
        return this.embed
            .setTitle(`👋 Membro rientrato`)
            .setDescription(`🎉 ${member.user} è rientrato nel server`)
            .addFields({
                name: "🎭 Ruoli ricevuti",
                value: string,
            })
            .setThumbnail(serverIcon);
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
            .setDescription(`${holiday.description}`)
            .setImage(holiday.image)
    }


    newguild(guild) {
        return this.embed
            .setTitle("🎉 Grazie per avermi invitato in " + guild.name)
            .setDescription(`Per iniziare a configurare il bot scrivi /initguild`)
            .setThumbnail(client.user.displayAvatarURL(
                { dynamic: true }
            ))
    }

}

module.exports = { EventEmbed }