const { PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { comandbembed } = require("../../../embed/base/command");
const { Menu } = require("../../../function/row/menu");
module.exports = {
    name: "unban",
    permisions: [PermissionsBitField.Flags.BanMembers],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: true,
    test: false,
    see: true,
    data: {
        name: "unban",
        description: "unban un utente"
    },
    execute(interaction) {

        let embed = new comandbembed(interaction.guild, interaction.member)

        interaction.guild.bans.fetch().then((bans) => {
            if (bans.size > 0) {
                embed.init().then(() => {
                    let list = []
                    let CMenu = new Menu()

                    let comandlist = new StringSelectMenuBuilder()
                        .setCustomId(`unbanuser-${interaction.member.id}`)
                        .setPlaceholder('Seleziona un utente da sbannare')

                    bans.forEach(member => {
                        list.push(new StringSelectMenuOptionBuilder()
                            .setLabel(`🏴‍☠️ ${member.user.globalName ? member.user.globalName : member.user.tag}`)
                            .setDescription(`ID: ${member.user.id}`)
                            .setValue(`${member.user.id}`))
                    });


                    interaction.reply({
                        embeds: [embed.unbanlist(bans.size)],
                        components: CMenu.createMenu(list, "unban", comandlist, interaction.member.id, 0),
                    });


                }).catch((err) => {
                    console.log(err)
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                    }
                    ).catch((err) => {
                        console.error(err);
                    })
                })


            } else {

                let embed = new comandbembed(interaction.guild, interaction.member)
                embed.init().then(() => {
                    interaction.reply({
                        embeds: [embed.notbanlist()],
                    });
                }).catch((err) => {
                    console.log(err)
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                    }
                    ).catch((err) => {
                        console.error(err);
                    })
                })



            }

        }).catch((err) => {
            console.log(err)
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.notlistbanerror()], ephemeral: true })
            }
            ).catch((err) => {
                console.error(err);
            })
        })





    }
}