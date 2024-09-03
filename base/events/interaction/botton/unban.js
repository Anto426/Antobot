const { botton } = require("../../../../function/interaction/botton");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { comandbembed } = require("../../../../embed/base/command");
const { BaseEmbed } = require("../../../../embed/baseembed");
const { Menu } = require("../../../../function/row/menu");
const { ErrEmbed } = require("../../../../embed/err/errembed");
module.exports = {
    name: "unban",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) return;

        if (interaction.customId.split("-").includes("unbanuser")) {
            let Cbotton = new botton()
            Cbotton.checkIsYourButton(interaction)
                .then(() => {
                    new BaseEmbed(interaction.guild, interaction.member).init().then((embedbase) => {
                        interaction.guild.bans.fetch().then(async (bans) => {
                            const iduser = interaction.values[0]
                            const member = bans.find(x => {
                                return x.user.id === iduser
                            })
                            embedbase
                                .setTitle(`Stai per Sbannare ${member.user.globalName ? member.user.globalName : member.user.tag}`)
                                .setDescription(`Sicuro di voler sbannare ${member.user.globalName ? member.user.globalName : member.user.tag} `)
                                .addFields(
                                    {
                                        name: "👤 Nome",
                                        value: member.user.globalName ? member.user.globalName.toString() : member.user.tag.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "🆔 ID",
                                        value: member.user.id.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "📅 Creato il",
                                        value: member.user.createdAt.toDateString(),
                                        inline: true
                                    },
                                    {
                                        name: "📝 Motivo",
                                        value: member.reason ? member.reason.toString() : "Non specificato",
                                        inline: true
                                    }
                                )
                                .setThumbnail(member.user.displayAvatarURL(
                                    {
                                        dynamic: true,
                                        size: 256
                                    }
                                ))
                                .setColor(embedconfig.color.green)


                            let row = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`unbanhub-${interaction.member.id}-down-${interaction.customId.split("-")[3]}`)
                                    .setLabel('Indietro')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId(`unbanf-${interaction.member.id}-${iduser}-${interaction.customId.split("-")[3]}`)
                                    .setLabel('Sbanna')
                                    .setStyle(ButtonStyle.Danger)
                            )

                            interaction.update({ embeds: [embedbase], components: [row] })



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
                }).catch(() => { })

        }

        if (interaction.customId.split("-").includes("unbanhub")) {
            let Cbotton = new botton()
            Cbotton.checkIsYourButton(interaction).then(() => {
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
            }).catch(() => { })





        }


        if (interaction.customId.split("-").includes("unbanf")) {

            let Cbotton = new botton()
            Cbotton.checkIsYourButton(interaction).then(() => {
                interaction.guild.bans.fetch().then(async (bans) => {
                    const iduser = interaction.customId.split("-")[2]
                    const member = bans.find(x => {
                        return x.user.id === iduser
                    })
                    let embed = new comandbembed(interaction.guild, interaction.member)
                    embed.init().then(() => {
                        interaction.guild.members.unban(member.user, "Unbanned").then(() => {
                            let row = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`unbanhub-${interaction.member.id}-down-${interaction.customId.split("-")[3]}`)
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
            }).catch(() => { })


        }
    }
}