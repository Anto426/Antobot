const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { comandbembed } = require("../../../../embed/base/command");
const { Cjson } = require("../../../file/json");
const { Menu } = require("../../../row/menu");
const { ErrEmbed } = require("../../../../embed/err/errembed");
const { BotConsole } = require("../../../log/botConsole");



class initguildpagebuilder {

    constructor() {
        this.Menu = new Menu();
        this.Cjson = new Cjson();
        this.botconsole = new BotConsole()
    }



    confirmedButton(interaction, interactioncustomId) {

        let buttonconfirm = new ButtonBuilder()
            .setCustomId(`initguild-${interaction.member.id}-${interactioncustomId[2]}-${interactioncustomId[3]}-c`)
            .setLabel('Conferma')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success)

        let buttondeny = new ButtonBuilder()
            .setCustomId(`initguild-${interaction.member.id}-${interactioncustomId[2]}-${interactioncustomId[3]}-d`)
            .setLabel('Negare')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Success)

        if (interactioncustomId[4] === "c") {
            buttonconfirm.setDisabled(true)
        } else if (interactioncustomId[4] === "d") {
            buttondeny.setDisabled(true)
        }

        let row = new ActionRowBuilder().addComponents(buttonconfirm, buttondeny)
        return this.buttondefault([row], interaction, interactioncustomId)
    }


    buttondefault(row, interaction, interactioncustomId) {

        let buttonnext = new ButtonBuilder()
            .setCustomId(`initguild-${interaction.member.id}-${parseInt(interactioncustomId[2]) + 1}-0`)
            .setLabel('Step Successivo')
            .setEmoji('🔝')
            .setStyle(ButtonStyle.Success)

        let buttonreset = new ButtonBuilder()
            .setCustomId(`initguild-${interaction.member.id}-0-0-r`)
            .setLabel('Reset Configurazione')
            .setEmoji('🔴')
            .setStyle(ButtonStyle.Success)

        let newrow = new ActionRowBuilder().addComponents(buttonreset, buttonnext)
        if (row.length === 2) {
            return [row[0], row[1], newrow]
        } else {
            return [row[0], newrow]
        }

    }


    channelMenu(interaction, interactioncustomId, min = 25) {

        let list = []

        interaction.guild.channels.cache.filter(x => x.type === ChannelType.GuildText).sort().forEach(channel => {
            list.push(new StringSelectMenuOptionBuilder()
                .setLabel(`${channel.name}`)
                .setDescription(`ID: ${channel.id}`)
                .setValue(`${channel.id}`))
        });

        let comandlist = new StringSelectMenuBuilder()
            .setCustomId(`initguild-${interaction.member.id}-${interactioncustomId[2]}-${interactioncustomId[3]}`)
            .setMaxValues(Math.min(list.length - 25 * parseInt(interactioncustomId[3]), min))
            .setPlaceholder('Seleziona un canale')

        return this.buttondefault(this.Menu.createMenu(list, "initguild", comandlist, interaction.member.id, interactioncustomId[2], interactioncustomId[3]), interaction, interactioncustomId)

    }

    roleMenu(interaction, interactioncustomId, min = 25) {

        let list = []

        interaction.guild.roles.cache.filter(x => x.name !== "@everyone").sort().forEach(role => {
            list.push(new StringSelectMenuOptionBuilder()
                .setLabel(`${role.name}`)
                .setDescription(`ID: ${role.id}`)
                .setValue(`${role.id}`))
        });

        let comandlist = new StringSelectMenuBuilder()
            .setCustomId(`initguild-${interaction.member.id}-${interactioncustomId[2]}-${interactioncustomId[3]}`)
            .setMaxValues(Math.min(list.length - 25 * parseInt(interactioncustomId[3]), min))
            .setPlaceholder('Seleziona un ruolo')

        return this.buttondefault(this.Menu.createMenu(list, "initguild", comandlist, interaction.member.id, interactioncustomId[2], interactioncustomId[3]), interaction, interactioncustomId)
    }



    async channelAllowpage(interaction, interactioncustomId) {

        return new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member)

            embed.init().then(async () => {

                let sendrow = await this.channelMenu(interaction, interactioncustomId)
                resolve([[embed.setchannelAllow(interactioncustomId[3])], sendrow])

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

    async channelRule(interaction, interactioncustomId) {

        return new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member)

            embed.init().then(async () => {

                let sendrow = await this.channelMenu(interaction, interactioncustomId, 1)

                resolve([[embed.SetRulechannel(interactioncustomId[3])], sendrow])

            }).catch((err) => {
                console.log(err)
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                }).catch((err) => {
                    console.error(err);
                })
            })

        })
    }


    async ChannelEvent(interaction, interactioncustomId) {

        return new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member, 1)

            embed.init().then(async () => {

                let sendrow = await this.channelMenu(interaction, interactioncustomId, 1)

                resolve([[embed.SetAnnuncechannel(interactioncustomId[3])], sendrow])

            }).catch((err) => {
                console.log(err)
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                }).catch((err) => {
                    console.error(err);
                })
            })

        })
    }


    async ChannelWelcome(interaction, interactioncustomId) {

        return new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member, 1)

            embed.init().then(async () => {

                let sendrow = await this.channelMenu(interaction, interactioncustomId, 1)

                resolve([[embed.SetWelcomechannel(interactioncustomId[3])], sendrow])

            }).catch((err) => {
                console.log(err)
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                }).catch((err) => {
                    console.error(err);
                })
            })

        })


    }


    async roleDefault(interaction, interactioncustomId) {

        return new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member)

            embed.init().then(async () => {

                let sendrow = await this.roleMenu(interaction, interactioncustomId, 1)

                resolve([[embed.SetDefaultRole(interactioncustomId[3])], sendrow])

            }).catch((err) => {
                console.log(err)
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                }).catch((err) => {
                    console.error(err);
                })
            })

        })

    }


    async roleBotDefault(interaction, interactioncustomId) {

        return new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member)

            embed.init().then(async () => {

                let sendrow = await this.roleMenu(interaction, interactioncustomId, 1)

                resolve([[embed.SetBotRole(interactioncustomId[3])], sendrow])

            }).catch((err) => {
                console.log(err)
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                }).catch((err) => {
                    console.error(err);
                })
            })

        })
    }




    async AllowTempChannel(interaction, interactioncustomId, root) {

        return new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member)

            embed.init().then(async () => {

                let sendrow = await this.confirmedButton(interaction, interactioncustomId, 1)

                console.log(sendrow)

                resolve([[embed.AllowTempChannel()], sendrow])

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

    async AllowHollyday(interaction, interactioncustomId) {

        return new Promise((resolve) => {

            let embed = new comandbembed(interaction.guild, interaction.member)

            embed.init().then(async () => {
                let sendrow = await this.confirmedButton(interaction, interactioncustomId)
                resolve([[embed.AllowHollyday()], sendrow])

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




    async ConfirmGuildConfig(interaction, interactioncustomId, root) {

        return new Promise((resolve) => {
            this.Cjson.readJson(root).then((data) => {

                if (data[interaction.guild.id]) {
                    if (data[interaction.guild.id].channel && data[interaction.guild.id].role) {
                        try {
                            let buttonconfirm = new ButtonBuilder()
                                .setCustomId(`initguild-${interaction.member.id}-${interactioncustomId[2]}-${interactioncustomId[3]}-c`)
                                .setLabel('Conferma')
                                .setEmoji('✅')
                                .setStyle(ButtonStyle.Success)

                            let buttonreset = new ButtonBuilder()
                                .setCustomId(`initguild-${interaction.member.id}-0-0-r`)
                                .setLabel('Reset Configurazione')
                                .setEmoji('🔴')
                                .setStyle(ButtonStyle.Success)


                            if (interactioncustomId[4] === "c") {
                                buttonconfirm.setDisabled(true)
                                buttonreset.setDisabled(true)
                            }

                            let guild = interaction.guild, allowcommandchennelname, roleChannel, annunceChannel, welcomeChannel, userroledefault, botroledefault, hollyday, tempchannel
                            let temp = []
                            data[interaction.guild.id].channel.allowchannel.forEach((element) => {
                                temp.push(guild.channels.cache.get(element).name)
                            })
                            allowcommandchennelname = temp.join("\n")
                            roleChannel = guild.roles.cache.get(data[interaction.guild.id].channel.rule) ? guild.roles.cache.get(data[interaction.guild.id].channel.rule).name : "Non impostato"
                            annunceChannel = guild.channels.cache.get(data[interaction.guild.id].channel.events) ? guild.channels.cache.get(data[interaction.guild.id].channel.events).name : "Non impostato"
                            welcomeChannel = guild.channels.cache.get(data[interaction.guild.id].channel.welcome) ? guild.channels.cache.get(data[interaction.guild.id].channel.welcome).name : "Non impostato"
                            userroledefault = guild.roles.cache.get(data[interaction.guild.id].role.roledefault) ? guild.roles.cache.get(data[interaction.guild.id].role.userroledefault).name : "Non impostato"
                            botroledefault = guild.roles.cache.get(data[interaction.guild.id].role.botroledefault) ? guild.roles.cache.get(data[interaction.guild.id].role.botroledefault).name : "Non impostato"
                            hollyday = data[interaction.guild.id].hollyday ? "✅ Abilitato" : "❌ Disabilitato";
                            tempchannel = data[interaction.guild.id].tempchannel ? "✅ Abilitato" : "❌ Disabilitato";
                            let row = new ActionRowBuilder().addComponents(
                                buttonconfirm, buttonreset
                            )
                            let embed = new comandbembed(interaction.guild, interaction.member)
                            embed.init().then(() => {
                                resolve([[embed.ConfirmGuildConfig(guild, allowcommandchennelname, roleChannel, annunceChannel, welcomeChannel, userroledefault, botroledefault, hollyday, tempchannel)], [row]])
                            }).catch((err) => {
                                console.log(err)
                                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                                embedmsg.init().then(() => {
                                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                                }).catch((err) => {
                                    console.error(err);
                                })
                            })
                        } catch (err) {
                            console.log(err)
                            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                            embedmsg.init().then(() => {
                                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                            }).catch((err) => {
                                console.error(err);
                            })
                        }
                    }
                } else {
                    reject(-1)
                }



            })
        })


    }


}



module.exports = { initguildpagebuilder }