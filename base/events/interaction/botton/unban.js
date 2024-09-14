const { botton } = require("../../../../function/interaction/botton");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { comandbembed } = require("../../../../embed/base/command");
const { Menu } = require("../../../../function/row/menu");
const { ErrEmbed } = require("../../../../embed/err/errembed");
module.exports = {
    name: "unban",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) return;

        let interactioncustomId = interaction.customId.split("-")
        if (interactioncustomId.includes("unban")) {
            let Cbotton = new botton()
            Cbotton.checkIsYourButton(interaction)
                .then(() => {
                    if (interactioncustomId[3] == 0) {
                        let embedmsg = new comandbembed(interaction.guild, interaction.member)
                        embedmsg.init()
                            .then(() => {
                                interaction.guild.bans.fetch().then(async (bans) => {
                                    const iduser = interaction.values[0]
                                    const member = bans.find(x => {
                                        return x.user.id === iduser
                                    })

                                    let row = new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`unban-${interaction.member.id}-${interactioncustomId[2] - 0}`)
                                            .setLabel('Indietro')
                                            .setStyle(ButtonStyle.Success),
                                        new ButtonBuilder()
                                            .setCustomId(`unban-${interaction.member.id}-2-${iduser}`)
                                            .setLabel('Sbanna')
                                            .setStyle(ButtonStyle.Danger)
                                    )

                                    interaction.update({ embeds: [embedmsg.confirmedBan(member)], components: [row] })

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
                                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                                }
                                ).catch((err) => {
                                    console.error(err);
                                })
                            })

                    }


                    if (interactioncustomId[3] == 1) {
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


                                    interaction.update({
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


                    if (interactioncustomId[2] == 2) {

                        interaction.guild.bans.fetch().then(async (bans) => {
                            const iduser = interactioncustomId[3]
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


                }).catch(() => { })
        }
    }
}