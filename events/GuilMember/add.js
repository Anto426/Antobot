const { ChannelType, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");
const { Captcha } = require('captcha-canvas');
const cguild = require("../../settings/guild.json")
const csetting = require("./../../settings/settings.json")
const { welcomeembed, logaddmember } = require("../../embeds/GuilMember/addembed");
const { createrowstartcaptcha } = require("../../functions/row/createrow");
const { captchastartembed } = require("../../embeds/moderation/captcha");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {

        try {
            if (!member.user.bot) {

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


                    let captcha = new Captcha();
                    captcha.async = true
                    captcha.addDecoy();
                    captcha.drawTrace();
                    captcha.drawCaptcha();


                    let captchaAttachement = new AttachmentBuilder(
                        await captcha.png, { name: 'captcha.png' }
                    )

                    let row = createrowstartcaptcha(member, captcha.text.toString())

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


