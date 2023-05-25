const { createCanvas, loadImage, registerFont } = require("canvas")
const { AttachmentBuilder } = require("discord.js");
const { welcomeembed } = require("../../embeds/GuilMember/add");
registerFont("./canavas/font/asapCondensed.ttf", { family: "asapCondensed" });
registerFont("./canavas/font/NotoSansJP-Bold.ttf", { family: "NotoSansJP-Bold" });
module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        try {


            if (!member.user.bot) {
                let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
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

                ctx.font = "100px asapCondensed","100px NotoSansJP-Bold"
                ctx.fillText(member.user.username.slice(0, 25), 500, canvas.height / 2)

                ctx.font = "50px asapCondensed"
                ctx.fillText(`${humans.size}° membro`, 500, 400)

                let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "canvas.png" })

                welcomeembed(member, humans.size, attachment)

            }
        } catch (err) { console.log(err) }
    }
}