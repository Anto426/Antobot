
const fs = require("fs")
const cembed = require("./../../../settings/embed.json")
const { Cautor } = require('../../../functions/interaction/checkautorinteraction');
const { genericerr } = require('../../../embeds/err/generic');
const { createrowcaptcha } = require("../../../functions/row/createrow");
const { captchaembed } = require("../../../embeds/moderation/captcha");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;

            if (interaction.customId.split("-").includes("capchastart")) {
                if (Cautor(interaction)) {

                    let row = createrowcaptcha(interaction.guild.members.cache.find(x => x.id == interaction.customId.split("-")[1]), interaction.customId.split("-")[2])

                    captchaembed(interaction.guild.members.cache.find(x => x.id == interaction.customId.split("-")[1]), row, interaction.channel)


                }


            }

            if (interaction.customId.split("-").includes("capcha")) {
                if (Cautor(interaction)) {
                    if (interaction.customId.split("-")[3] == "t") {

                        let category1 = member.guild.channels.cache.find(x => x.name == "╚»★«╝ Backup ╚»★«╝")
                        if (!category1) {
                            category1 = await member.guild.channels.create('╚»★«╝ Backup ╚»★«╝', {
                                type: ChannelType.GuildCategory,
                                permissionOverwrites: [{
                                    id: member.guild.roles.everyone,
                                    deny: ChannelType.GuildCategory
                                }]
                            })
                        }
                        await channelverifica.permissionOverwrites.delete(member.id).then((channels) => {
                            channels.setParent(category1);
                        })
                        category.delete().catch(() => { })
                        channelverifica.send({ embeds: [messagedelete], components: [row] })
                    } else {
                        member.kick()
                    }



                }

            }


        } catch (err) { genericerr(interaction, err) }

    }
}