const { Cautor } = require('../../../functions/interaction/checkautorinteraction');
const { ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { genericerr } = require('../../../embeds/err/generic');
const cguild = require("./../../../settings/guild.json")
const { createrowcaptcha, createrowstartchanneldelete } = require("../../../functions/row/createrow");
const { captchaembed, captchaembedsucc, captchaembednotv, captchadelbackup } = require("../../../embeds/moderation/captcha");
const { welcomeembed, logaddmember, logaddmembernotv } = require("../../../embeds/GuilMember/addembed");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;

            if (interaction.customId.split("-").includes("capchastart")) {
                if (Cautor(interaction)) {

                    let row = createrowcaptcha(interaction.guild.members.cache.find(x => x.id == interaction.customId.split("-")[1]), interaction.customId.split("-")[2])

                    captchaembed(interaction.guild.members.cache.find(x => x.id == interaction.customId.split("-")[1]), row, interaction)

                }


            }

            if (interaction.customId.split("-").includes("capcha")) {

                if (Cautor(interaction)) {

                    let category = interaction.guild.channels.cache.find(x => x.name == "╚»★«╝ verifica ╚»★«╝")
                    let category1 = interaction.guild.channels.cache.find(x => x.name == "╚»★«╝ Backup ╚»★«╝")

                    const originalRow = interaction.message.components.find(component => component.type === 1);

                    // Creare una copia del componente 'row' originale
                    let updatedRow = new ActionRowBuilder().addComponents(...originalRow.components);

                    updatedRow.components.forEach(button => {
                        button.data.disable = true
                        console.log(button)
                    });
                    console.log(updatedRow)
                    await interaction.message.edit({ components: [updatedRow] })


                    if (interaction.customId.split("-")[3] == "t") {
                        let [bots, humans] = (await interaction.guild.members.fetch()).partition(member => member.user.bot);
                        captchaembedsucc(interaction.member, interaction)
                        logaddmember(interaction.member, humans.size)
                        welcomeembed(interaction.member, humans.size)
                        interaction.member.roles.add(interaction.guild.roles.cache.get(cguild["Anto's  Server"].role.user))
                    } else {
                        captchaembednotv(interaction.member, interaction.channel)
                        logaddmembernotv(interaction.member)
                        setTimeout(() => {
                            interaction.member.kick()
                        }, 60 * 1000)

                    }
                    setTimeout(async () => {
                        if (!category1) {
                            category1 = await interaction.guild.channels.create({
                                name: '╚»★«╝ Backup ╚»★«╝',
                                type: ChannelType.GuildCategory,
                                permissionOverwrites: [{
                                    id: interaction.guild.roles.everyone,
                                    deny: [PermissionFlagsBits.ViewChannel]
                                }]
                            })
                        }
                        await interaction.channel.permissionOverwrites.delete(interaction.member.id).then((channels) => {
                            channels.setParent(category1);
                        })
                        category.delete().catch(() => { })

                        let row = createrowstartchanneldelete()
                        captchadelbackup(interaction.channel, row)

                    }, 60 * 1000)


                }

            }


        } catch (err) { genericerr(interaction, err) }

    }
}