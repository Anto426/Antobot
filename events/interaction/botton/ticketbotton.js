const jsonf = require("../../../function/json/jsnonfunctions")
const check = require("../../../function/check/check")
const configs = require("../../../index")
const arreyf = require("./../../../function/arrey/arreyfunctions")
const froomandtiket = require("../../../function/privateroomandticket/privateroomandticketfunctions")
const { ChannelType, PermissionsBitField, ButtonStyle } = require('discord.js');
const { InteractionType } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {
            let file = `./Database/${interaction.guild.name}/ticket.json`

            if (interaction.customId == "opentiket") {


                var result1
                check.filecheck(file)
                    .then(async (result) => {
                        result1 = result
                        if (result) {
                            let content = await jsonf.jread(file)
                            return arreyf.arreycheckelement(content.list, interaction.member.id)
                        }
                    }).then(async (trovato) => {
                        if (!trovato) {
                            let content
                            if (result1) {
                                content = await jsonf.jread(file)
                            } else {
                                content = { "list": [] }
                            }

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
                            content.list.push({ "IDuser": [interaction.member.id], "IDticket": [ticketchannel.id] })
                            jsonf.jwrite(file, content)

                            let embed = new configs.Discord.EmbedBuilder()
                                .setTitle("Ticket creato")
                                .setDescription("Ticket creato con successo aspetta che lo staff ti risponda!")
                                .setThumbnail(configs.settings.embed.images.succes)
                                .setColor(configs.settings.embed.color.green)

                            let row = new configs.Discord.ActionRowBuilder()
                                .addComponents(
                                    new configs.Discord.ButtonBuilder()
                                        .setCustomId('closedticket')
                                        .setStyle(ButtonStyle.Danger)
                                        .setLabel('Chiudi il ticket'),
                                );

                            interaction.reply({ embeds: [embed], ephemeral: true })
                            ticketchannel.send({ embeds: [embed], components: [row] })
                        } else {
                            let content = await jsonf.jread(file)
                            let id = await froomandtiket.findchannel(content.list, interaction.member)
                            let embed = new configs.Discord.EmbedBuilder()
                                .setTitle("Error")
                                .setDescription("Hai gia un ticket aperto <#" + id + ">")
                                .setThumbnail(configs.settings.embed.images.error)
                                .setColor(configs.settings.embed.color.red)
                            interaction.reply({ embeds: [embed], ephemeral: true })
                        }
                    })

            }
            if (interaction.customId == "closedticket") {

                check.filecheck(file).then(async (result) => {
                    if (result) {
                        froomandtiket.closetticketandroom(file, interaction.member)
                    } else {
                        interaction.channel.delete()
                    }
                })



            }


        }



    }
}

