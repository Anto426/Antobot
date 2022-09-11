const { createCanvas, loadImage, registerFont } = require("canvas")
registerFont("./canavas/Welcomeandleft/font/Glitch.ttf", { family: "glitch" })
const configs = require("./../../index")

async function createimage(member, title, type) {
    let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
    let canvas = await createCanvas(1700, 600)
    let ctx = await canvas.getContext("2d")
    let img = await loadImage("./canavas/Welcomeandleft/img/backgrounds.jpg")
    ctx.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.height / 2)


    ctx.fillStyle = "rgba(0,0,0,0.30)"
    ctx.fillRect(70, 70, canvas.width - 70 - 70, canvas.height - 70 - 70)

    ctx.save()
    ctx.beginPath()
    ctx.arc(150 + 300 / 2, canvas.height / 2, 150, 0, 2 * Math.PI, false)
    ctx.clip()
    img = await loadImage(member.displayAvatarURL({ format: "png" }))
    ctx.drawImage(img, 150, canvas.height / 2 - 300 / 2, 300, 300)
    ctx.restore()


    ctx.fillStyle = "#fff"
    ctx.textBaseline = "middle"

    ctx.font = "80px glitch"
    ctx.fillText(title, 500, 200)

    ctx.font = "100px glitch"
    ctx.fillText(member.user.username.slice(0, 25), 500, canvas.height / 2)

    if (type) {
        ctx.font = "50px glitch"
        ctx.fillText(`${humans.size}° membro`, 500, 400)
    }


    const buffer = canvas.toBuffer("canvas.png");
    return buffer



}




module.exports = {
    createimage: createimage
}