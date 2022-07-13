const { createCanvas, loadImage, registerFont } = require("canvas")
registerFont("./canavas/Welcome/font/Glitch.ttf", { family: "glitch" })
module.exports = {
    name: `guildMemberAdd`,
    async execute(member) {
        if (!member.user.bot) {
            let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
            let canvas = await createCanvas(1700, 600)
            let ctx = await canvas.getContext("2d")
            let img = await loadImage("./canavas/Welcome/img/backgrounds.jpg")
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
            ctx.fillText("Benvenuto", 500, 200)

            ctx.font = "100px glitch"
            ctx.fillText(member.user.username.slice(0, 25), 500, canvas.height / 2)

            ctx.font = "50px glitch"
            ctx.fillText(`${humans.size}° membro`, 500, 400)

            let channel = client.channels.cache.get(configs[member.guild.name].stanze.welcome)

            let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "canvas.png")


            let embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Welcome")
                .setDescription(`${member} Benvenuto su ${member.guild.name} te sei il ${humans.size} membro  ! Ti consiglio di andare a leggere il <#${configs[member.guild.name].stanze.regolamento}> per non essere bannato !!`)
                .setImage("attachment://canvas.png")

            channel.send({ embeds: [embed], files: [attachment] })

        }
    }

}