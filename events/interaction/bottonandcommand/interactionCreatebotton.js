let functions = require("./../../../function/globalfunction")
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isCommand()) {
            if (interaction.customId == "deletechat") {
                interaction.channel.delete()

            }

            if (interaction.customId == "mc") {
                for (server in configs.game.mc) {
                    let embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle("Ecco il tuo server")

                    if (interaction.values[0] == server) {
                        console.log(server)
                        embed.setThumbnail(configs.game.mc[server].images)
                        embed.setDescription(configs.game.mc[server].server);
                        interaction.reply({ embeds: [embed] })
                        setTimeout(() => interaction.deleteReply(), 10000)

                    }
                }



            }




            if (interaction.customId == "opentiket") {
                functions.dir(interaction)
                functions.read(interaction, "ticket").then(async(a) => {
                    if (!a) {
                        let category = client.channels.cache.get(configs[interaction.guild.name].stanze.tiket)
                        let channelname = "「🎫」Tiket" + new Date().getMinutes() + new Date().getHours() + new Date().getDate() + new Date().getMonth()
                        let channel = await functions.createchannel(interaction, channelname, "GUILD_TEXT", category, true)
                        console.log(channel)
                        functions.write(interaction, "ticket", channel)
                    }
                })





            }

            if (interaction.customId == "closedtiket") {
                functions.remove(interaction, "ticket")
                return
            }

            if (interaction.customId == "onlytext" || interaction.customId == "onlyvoice" || interaction.customId == "text+voice") {
                functions.dir(interaction)
                await functions.read(interaction, "room").then(async(a) => {
                    if (!a) {
                        const category = interaction.guild.channels.cache.find(x => x.name == "🔐Stanze private🔐")
                        let channelname = ""
                        let type = ""
                        let type2 = false
                        if (interaction.customId == "onlytext") {
                            type = "GUILD_TEXT"
                            channelname = "「💭」" + interaction.member.user.tag
                            let channel = await functions.createchannel(interaction, channelname, type, category, false)
                            functions.write(interaction, "room", channel)
                        }
                        if (interaction.customId == "onlyvoice") {
                            type = "GUILD_VOICE"
                            channelname = "「🔊」" + interaction.member.user.tag
                            let channel = await functions.createchannel(interaction, channelname, type, category, false)
                            functions.write(interaction, "room", channel)
                        }
                        if (interaction.customId == "text+voice") {
                            type = "GUILD_TEXT"
                            channelname = "「💭」" + interaction.member.user.tag
                            for (let i = 0; i < 2; i++) {
                                let channel = await functions.createchannel(interaction, channelname, type, category, false)
                                functions.write(interaction, "room", channel, type2)
                                type = "GUILD_VOICE"
                                channelname = "「🔊」" + interaction.member.user.tag
                                type2 = true
                            }
                        }


                        let role = await interaction.guild.roles.create({
                            name: `private room ${interaction.member.user.tag}`,
                        })
                        interaction.member.roles.add(role)
                    }

                })


            }

            if (interaction.customId == "closedroom") {
                functions.remove(interaction, "room")




            }


            if (interaction.customId.split("-").includes("help")) {

                idobject = require("./../../../commands/help/help")
                let folders = []

                let commandsFolder = fs.readdirSync("./commands");
                for (const folder of commandsFolder) {
                    if (folder != "help")
                        folders.push(folder)
                }

                if (idobject.interaction) {
                    if (interaction.customId.toString().split("-").includes(interaction.member.id)) {
                        folders.forEach(async x => {
                            if (interaction.values == x) {
                                let commands = new Discord.Collection();
                                const commandsFiles = fs.readdirSync(`./commands/${x}`);
                                for (const file of commandsFiles) {
                                    if (file.endsWith(".js")) {
                                        const command = require(`./../../../commands/${x}/${file}`);
                                        commands.set(command.name, command);
                                    } else {
                                        const commandsFiles2 = fs.readdirSync(`./commands/${x}/${file}`)
                                        for (const file2 of commandsFiles2) {
                                            const command = require(`./../../../commands/${x}/${file}/${file2}`);
                                            commands.set(command.name, command);
                                        }
                                    }
                                }
                                let msg = []
                                commands.forEach(x => {
                                    msg.push(`
/${x.data.name}
${x.data.description}
                                    `)
                                })

                                const embed = new Discord.MessageEmbed()
                                    .setTitle("Help")
                                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                    .setColor(configs.embed.color.purple)
                                    .setDescription(`
Usa il menu qui sotto per scegliere la categoria di comandi da vedere!

${interaction.values.toString().toUpperCase()}
\`\`\`
${msg.join(" ").toString()}
                 \`\`\`


                                     `)
                                interaction.update({ embeds: [embed] })

                            }
                        })
                    } else {

                        const embed = new Discord.MessageEmbed()
                            .setTitle("Error")
                            .setDescription("Non è il tuo questo menu!")
                            .setThumbnail(configs.embed.images.error)
                            .setColor(configs.embed.color.red)
                        interaction.reply({ embeds: [embed], ephemeral: true })
                    }
                } else {

                    const embed = new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription("Il bot è stato riavviato per favore crea un'altro menu")
                        .setThumbnail(configs.embed.images.error)
                        .setColor(configs.embed.color.red)
                    interaction.reply({ embeds: [embed], ephemeral: true })
                }

            }

        }
    }

}