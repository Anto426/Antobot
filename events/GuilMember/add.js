const { ChannelType, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas")
const cguild = require("../../settings/guild.json")
const csetting = require("./../../settings/settings.json")
const { welcomeembed, logaddmember } = require("../../embeds/GuilMember/addembed");
const { createrowstartcaptcha } = require("../../functions/row/createrow");
const { captchastartembed } = require("../../embeds/moderation/captcha");
const { randomChar } = require("../../functions/random/random");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {

        try {
            if (!member.user.bot) {

                registerFont("./canavas/font/LexendZetta.ttf", { family: "Lexend Zetta" });
                if (csetting.captcha) {
                    let category = member.guild.channels.cache.find(x => x.name == "╚»★«╝ verifica ╚»★«╝")
                    if (!category) {
                        category = await member.guild.channels.create({
                            name: '╚»★«╝ verifica ╚»★«╝',
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [{
                                id: member.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            }, {
                                id: member.guild.roles.everyone,
                                deny: [PermissionFlagsBits.ViewChannel]
                            }]
                        })
                    }
                    let name = "—͟͞͞🔍】" + member.user.tag
                    let channelverifica = await member.guild.channels.create({
                        name: name,
                        type: ChannelType.GuildText,
                        parent: category,
                        permissionOverwrites: [{
                            id: member.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        }, {
                            id: member.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel]
                        }]
                    })
                    let captchatext = ``;
                    for (let z = 0; z < 5; z++)
                        captchatext += randomChar();

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
                    ctx.restore()


                    ctx.fillStyle = "#fff"
                    ctx.textBaseline = "middle"


                    ctx.font = `150px "Lexend Zetta"`
                    ctx.fillText(captchatext, 500, canvas.height / 2)

                    let captchaAttachement = new AttachmentBuilder(canvas.toBuffer(), { name: "captcha.png" })

                    let row = createrowstartcaptcha(member, captchatext)

                    captchastartembed(member, captchaAttachement, row, channelverifica)



                } else {

                    let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
                    welcomeembed(member, humans.size)
                    logaddmember(member, humans.size)
                    member.roles.add(member.guild.roles.cache.get(cguild["Anto's  Server"].role.user))
                }
            } else {
                member.roles.add(member.guild.roles.cache.get(cguild["Anto's  Server"].role.bot))
            }

        } catch (err) { console.log(err) }
    }
}


