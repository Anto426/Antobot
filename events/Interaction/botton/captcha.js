
const fs = require("fs")
const cembed = require("./../../../settings/embed.json")
const { Cautor } = require('../../../functions/interaction/checkautorinteraction');
const { genericerr } = require('../../../embeds/err/generic');
const { createrowcaptcha } = require("../../../functions/row/createrow");
const { captchaembed } = require("../../../embeds/moderation/captcha");
const { welcomeembed, logaddmember, logaddmembernotv } = require("../../../embeds/GuilMember/addembed");

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
                        let [bots, humans] = (await member.guild.members.fetch()).partition(member => member.user.bot);
                        welcomeembed(interaction.member, humans.size)
                        logaddmember(interaction.member, humans.size)
                    } else {
                        logaddmembernotv(interaction.member)
                        member.kick()
                    }
                    let category = interaction.guild.channels.cache.find(x => x.name == "╚»★«╝ verifica ╚»★«╝")
                    let channelverifica = interaction.guild.channels.cache.find(x => x.name == "—͟͞͞🔍】" + member.user.tag)
                    let category1 = interaction.guild.channels.cache.find(x => x.name == "╚»★«╝ Backup ╚»★«╝")
                    if (!category1) {
                        category1 = await interaction.guild.channels.create('╚»★«╝ Backup ╚»★«╝', {
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [{
                                id: interaction.guild.roles.everyone,
                                deny: ChannelType.GuildCategory
                            }]
                        })
                    }
                    await channelverifica.permissionOverwrites.delete(member.id).then((channels) => {
                        channels.setParent(category1);
                    })
                    category.delete().catch(() => { })
                    channelverifica.send({ embeds: [messagedelete], components: [row] })


                }

            }


        } catch (err) { genericerr(interaction, err) }

    }
}