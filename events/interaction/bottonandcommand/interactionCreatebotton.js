async function remove(interaction, type) {
    temp = [];
    let file = `./Database/${interaction.guild.name}/${type}.json`
    fs.readFile(file, async function(err, content) {
        if (err) throw err;
        var parseJson = JSON.parse(content);

        parseJson.list.forEach((x) => {
            if (x.name != interaction.member.user.tag) {
                temp.push(x)
            } else {
                for (y in x) {
                    if (y != "name") {
                        let channel = interaction.guild.channels.cache.get(x[y])
                        try {
                            channel.delete()
                        } catch {}
                    }
                }


            }
        })
        parseJson.list = temp
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })

    })

    if (type = "room") {

        interaction.guild.roles.cache.forEach(role => {
            if (role.name.includes(interaction.member.user.tag)) {
                role.delete()
            }
        });

    }

}
async function createchannel(interaction, channelname, type, category, type2) {
    try {
        let channel = await interaction.guild.channels.create(channelname, {
            type: type,
            parent: category,
            topic: interaction.member.user.tag,
            permissionOverwrites: [{
                id: interaction.member.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            }, {
                id: interaction.member.guild.roles.everyone,
                deny: ["VIEW_CHANNEL"]
            }]
        })
        if (type2) {
            let embed = new Discord.MessageEmbed()
                .setTitle("hey ciao ci dispiace che hai avuto problemi!")
                .setDescription("<@" + interaction.member + ">" + " tiket creato con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes() + " attendi che lo staff ti risponda")
                .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                .setColor(configs.embed.color.green)
            let row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('closedtiket')
                    .setStyle('DANGER')
                    .setLabel('chiudi il ticket'),
                );
            channel.send({ embeds: [embed], components: [row] })

        } else {
            if (channel.type == "GUILD_TEXT") {
                const commandsFiles = fs.readdirSync(`./commands/privaroom`);
                let commands = new Discord.Collection();
                for (const file of commandsFiles) {
                    if (file.endsWith(".js")) {
                        const command = require(`./../../../commands/privaroom/${file}`);
                        commands.set(command.name, command);
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
                    .setTitle("hey ciao ")
                    .setDescription("<@" + interaction.member + ">" + " stanza creata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes() +
                        `\`\`\`js
${msg.join(" ").toString()}
                 \`\`\``)
                    .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                    .setColor("#51ff00")
                let row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                        .setCustomId('closedroom')
                        .setStyle('DANGER')
                        .setLabel('elimina stanze'),
                    );

                channel.send({ embeds: [embed], components: [row] })
            }
        }

        return channel

    } catch (err) { console.log(err) }


}

async function dir(interaction) {

    let directory = `./Database/${interaction.guild.name}`
    try {
        fs.lstatSync(directory).isDirectory()
    } catch {
        const path = require('path');


        fs.mkdir(path.join(`./Database/`, interaction.guild.name), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('Directory created successfully!');
        });
    }
}

async function read(interaction, type) {
    let file = `./Database/${interaction.guild.name}/${type}.json`
    const name = interaction.member.user.tag
    var trovata = false
    try {
        let file = `./Database/${interaction.guild.name}/${type}.json`
        let content = fs.readFileSync(file)
        var parseJson = JSON.parse(content)

        parseJson.list.forEach((x) => {
            if (x.name == interaction.member.user.tag) {
                console.log(x)
                trovata = true
            }
        })


        if (trovata) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription("Impossibile aprire la stanza ne hai già una")
                .setColor(configs.embed.color.red)
                .setThumbnail("https://i.imgur.com/5dNAgln.gif")
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

        }

    } catch (err) {

        console.log(err)
        let parseJson = {
            "list": []
        }
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })


    }
    return trovata



}


function write(interaction, type, channel, type2) {
    if (type2) {
        let file = `./Database/${interaction.guild.name}/${type}.json`
        let content = fs.readFileSync(file)
        var parseJson = JSON.parse(content)

        parseJson.list.forEach((x) => {
            if (x.name == interaction.member.user.tag) {
                x.channelid1 = channel.id
            }
        })
        console.log(parseJson)
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })
    } else {
        let file = `./Database/${interaction.guild.name}/${type}.json`
        let info = { "name": `${interaction.member.user.tag}`, "channelid": `${channel.id}` }
        fs.readFile(file, async function(err, content) {
            if (err) throw err;
            var parseJson = JSON.parse(content)
            parseJson.list.push(info)
            fs.writeFile(file, JSON.stringify(parseJson), function(err) {
                if (err) throw err;
            })
        })
        if (type == "ticket") {
            let embed1 = new Discord.MessageEmbed()
                .setTitle("tiket creato")
                .setDescription("ticket creato con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes() + " attendi che lo staff ti risponda")
                .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                .setColor(configs.embed.color.green)
            interaction.reply({
                embeds: [embed1],
                ephemeral: true
            })
        }
        if (type == "room") {
            let embed1 = new Discord.MessageEmbed()
                .setTitle("stanza creata")
                .setDescription("stanza creata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
                .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                .setColor(configs.embed.color.green)
            interaction.reply({
                embeds: [embed1],
                ephemeral: true
            })

        }
    }
}


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
                dir(interaction)
                read(interaction, "ticket").then(async(a) => {
                    if (!a) {
                        let category = client.channels.cache.get(configs[interaction.guild.name].stanze.tiket)
                        let channelname = "「🎫」Tiket" + new Date().getMinutes() + new Date().getHours() + new Date().getDate() + new Date().getMonth()
                        let channel = await createchannel(interaction, channelname, "GUILD_TEXT", category, true)
                        console.log(channel)
                        write(interaction, "ticket", channel)
                    }
                })





            }

            if (interaction.customId == "closedtiket") {
                remove(interaction, "ticket")
                return
            }

            if (interaction.customId == "onlytext" || interaction.customId == "onlyvoice" || interaction.customId == "text+voice") {
                dir(interaction)
                await read(interaction, "room").then(async(a) => {
                    if (!a) {
                        const category = interaction.guild.channels.cache.find(x => x.name == "🔐Stanze private🔐")
                        let channelname = ""
                        let type = ""
                        let type2 = false
                        if (interaction.customId == "onlytext") {
                            type = "GUILD_TEXT"
                            channelname = "「💭」" + interaction.member.user.tag
                            let channel = await createchannel(interaction, channelname, type, category, false)
                            write(interaction, "room", channel)
                        }
                        if (interaction.customId == "onlyvoice") {
                            type = "GUILD_VOICE"
                            channelname = "「🔊」" + interaction.member.user.tag
                            let channel = await createchannel(interaction, channelname, type, category, false)
                            write(interaction, "room", channel)
                        }
                        if (interaction.customId == "text+voice") {
                            type = "GUILD_TEXT"
                            channelname = "「💭」" + interaction.member.user.tag
                            for (let i = 0; i < 2; i++) {
                                let channel = await createchannel(interaction, channelname, type, category, false)
                                write(interaction, "room", channel, type2)
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
                remove(interaction, "room")




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