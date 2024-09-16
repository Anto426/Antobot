const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { comandbembed } = require("../../../embed/base/command");
const { Menu } = require("../../row/menu");
const { ErrEmbed } = require("../../../embed/err/errembed");

class unbanpagebuilder {

    constructor() {
        this.Menu = new Menu();
    }

    async mainpage(interaction) {

        return await new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member)

            interaction.guild.bans.fetch().then((bans) => {
                if (bans.size > 0) {
                    embed.init().then(() => {
                        let list = []
                        let CMenu = new Menu()

                        let comandlist = new StringSelectMenuBuilder()
                            .setPlaceholder('Seleziona un utente da sbannare')

                        bans.forEach(member => {
                            list.push(new StringSelectMenuOptionBuilder()
                                .setLabel(`🏴‍☠️ ${member.user.globalName ? member.user.globalName : member.user.tag}`)
                                .setDescription(`ID: ${member.user.id}`)
                                .setValue(`${member.user.id}`))
                        });

                        resolve([[embed.unbanlist(list.length)], CMenu.createMenu(list, "unban", comandlist, interaction.member.id, 1, 0)])


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


        });




    }

    async userpage(interaction, interactioncustomId) {

        return await new Promise((resolve) => {

            let embedmsg = new comandbembed(interaction.guild, interaction.member)
            embedmsg.init()
                .then(() => {
                    interaction.guild.bans.fetch().then(async (bans) => {
                        const iduser = interaction.values[0]
                        const member = bans.find(x => {
                            return x.user.id === iduser
                        })

                        if (member) {

                            let row = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`unban-${interaction.member.id}-0-${interactioncustomId[2]}`)
                                    .setLabel('Indietro')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId(`unban-${interaction.member.id}-2-0-${iduser}`)
                                    .setLabel('Sbanna')
                                    .setStyle(ButtonStyle.Danger)
                            )

                            resolve([[embedmsg.confirmedBan(member)], [row]])
                        } else {
                            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                            embedmsg.init().then(() => {
                                interaction.reply({ embeds: [embedmsg.membernotfoundError()], ephemeral: true })
                            }
                            ).catch((err) => {
                                console.error(err);
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

        })



    }

    async unbanconfirmedpage(interaction, interactioncustomId) {


        interaction.guild.bans.fetch().then(async (bans) => {
            const iduser = interactioncustomId[4]
            const member = bans.find(x => {
                return x.user.id === iduser
            })

            let embed = new comandbembed(interaction.guild, interaction.member)
            embed.init().then(() => {
                interaction.guild.members.unban(member.user, "Unbanned").then(() => {
                    let row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`unban-${interaction.member.id}-${interaction.customId.split("-")[3]}-1`)
                            .setLabel('Indietro')
                            .setStyle(ButtonStyle.Success)
                    )

                    interaction.update({ embeds: [embed.unban(member)], components: [row] })
                }).catch((err) => {
                    console.log(err)
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.notunbannedError()], ephemeral: true })
                    }
                    ).catch((err) => {
                        console.error(err);
                    })
                })

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



module.exports = { unbanpagebuilder }