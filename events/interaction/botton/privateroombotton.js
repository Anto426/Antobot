const jsonf = require("../../../function/json/jsnonfunctions")
const check = require("../../../function/check/check")
const configs = require("../../../index")
const arreyf = require("./../../../function/arrey/arreyfunctions")
const froomandtiket = require("../../../function/privateroomandticket/privateroomandticketfunctions")
const { ChannelType, PermissionsBitField, ButtonStyle } = require('discord.js');
const { InteractionType } = require('discord.js');
const errormsg = require("./../../../function/msg/errormsg")



module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {


            async function dubleroom(content, content2) {
                let channel = await createchannel(channelname, category, type)
                content.list.push(content2)
                jsonf.jwrite(file, content)
            }
            async function createchannel(name, category, type) {
                let roomchannel = await interaction.guild.channels.create({
                    name: name,
                    type: type,
                    parent: category,
                    permissionOverwrites: [{
                        id: interaction.member.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                    }, {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }]
                })

                if (roomchannel.type == ChannelType.GuildText) {
                    let embed = new configs.Discord.EmbedBuilder()
                        .setTitle("hey ciao ")
                        .setDescription("<@" + interaction.member + ">" + " stanza creata con succeso")
                        .setThumbnail(configs.settings.embed.images.succes)
                        .setColor(configs.settings.embed.color.green)
                    let row = new configs.Discord.ActionRowBuilder()
                        .addComponents(
                            new configs.Discord.ButtonBuilder()
                                .setCustomId('closedticket')
                                .setStyle(ButtonStyle.Danger)
                                .setLabel('Chiudi stanza'),
                        );
                    roomchannel.send({ embeds: [embed], components: [row] })
                }
            }


            if (interaction.customId == "onlytext" || interaction.customId == "onlyvoice" || interaction.customId == "text+voice") {
                let file = `./Database/${interaction.guild.name}/room.json`
                let directory = `./Database`
                check.dircheck(directory, interaction.guild.name)
                if (check.filecheck(file)) {
                    let content = {
                        "list": []
                    }
                    jsonf.jwrite(file, content)
                }
                let contet = jsonf.jread(file)
                console.log(contet.list)
                let pro = arreyf.arreyfindlement(contet.list, interaction.member.id)
                pro.then(async (f) => {
                    console.log(f)
                    if (!f) {
                        errormsg.disablefunction(interaction)
                    } else {
                        let category = interaction.guild.channels.cache.find(x => x.name == "🔐Stanze private🔐")
                        let channelname = ""
                        let type = ""
                        if (interaction.customId == "onlytext") {
                            type = ChannelType.GuildText
                            channelname = "「💭」" + interaction.member.user.username
                            let channel = await createchannel(channelname, category, type)
                            contet.list.push({ "IDuser": [interaction.member.id], "IDroom": [channel.id] })
                            jsonf.jwrite(file, contet)
                        }
                        if (interaction.customId == "onlyvoice") {
                            type = ChannelType.GuildVoice
                            channelname = "「🔊」" + interaction.member.user.username
                            let channel = await createchannel(channelname, category, type)
                            contet.list.push({ "IDuser": [interaction.member.id], "IDroom": [channel.id] })
                            jsonf.jwrite(file, contet)
                        }
                        if (interaction.customId == "text+voice") {
                            type = ChannelType.GuildText
                            channelname = "「💭」" + interaction.member.user.username
                            for (let i = 0; i < 2; i++) {
                                let channel = await createchannel(channelname, category, type)
                                type = ChannelType.GuildVoice
                                channelname = "「🔊」" + interaction.member.user.username

                            }
                        }
                    }
                })


            }

            if (interaction.customId == "closedroom") { }
        }
    }

}