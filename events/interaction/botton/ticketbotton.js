const jsonf = require("../../../function/json/jsnonfunctions")
const check = require("../../../function/check/check")
const configs = require("../../../index")
const { ChannelType, PermissionsBitField } = require('discord.js');
const { InteractionType } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {

            if (interaction.customId == "opentiket") {

                let file = `./Database/${interaction.guild.name}/ticket.json`

                let trovato = false
                check.filecheck(file)
                    .then(async (result) => {
                        if (result) {
                            trovato = await async function () {
                                let a = false
                                var content = await jsonf.jread(file)
                                content.list.forEach(async x => {
                                    for (let y in x) {
                                        console.log(x[y])
                                        console.log(x[y] == interaction.member.id)
                                        if (x[y] == interaction.member.id) { a = true }
                                    }

                                });
                                return a
                            }
                            
                        }
                    })
                console.log(trovato)
                if (!trovato) {
                    let content
                    check.filecheck(file)
                        .then(async (result) => {
                            if (result) {
                                content = await jsonf.jread(file)
                            } else {
                                content = { "list": [] }
                            }
                        })
                    let category = interaction.guild.channels.cache.find(x => x.name == "🎫ticket🎫")
                    let ticketchannel = await interaction.guild.channels.create({
                        name: "「🎫」ticket " + new Date().getMinutes() + new Date().getHours() + new Date().getDate() + new Date().getMonth(),
                        type: ChannelType.GuildText,
                        parent: category,
                        permissionOverwrites: [{
                            id: interaction.member.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        }, {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        }]
                    })

                    console.log(content)
                    content.list.push({ "IDuser": [interaction.member.id], "IDticket": [ticketchannel.id] })
                    jsonf.jwrite(file, content)
                } else {

                }
            }
        }

        if (interaction.customId == "closedtiket") { }

    }
}

