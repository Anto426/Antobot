async function remove(interaction, type) {
    let member = interaction.member || interaction
    temp = [];
    let file = `./Database/${member.guild.name}/${type}.json`
    let content = fs.readFileSync(file)
    var parseJson = JSON.parse(content)
    let trovata = false
    parseJson.list.forEach((x) => {
        if (x.iduser != member.id) {
            temp.push(x)
        } else {
            for (y in x) {
                trovata = true
                console.log(y)
                if (y != "iduser") {

                    let channel = member.guild.channels.cache.get(x[y])
                    try {
                        channel.delete()
                    } catch (err) { console.log(err) }
                }
            }


        }
    })
    parseJson.list = temp
    fs.writeFile(file, JSON.stringify(parseJson), function(err) {
        if (err) throw err;
    })

    console.log(trovata)

    if (!trovata) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription("Non sei stato te a creare questa stanza o questo ticket")
            .setThumbnail(configs.embed.images.error)
            .setColor(configs.embed.color.red)
        interaction.reply({ embeds: [embed], ephemeral: true })

    }
    if (type == "room") {

        member.guild.roles.cache.forEach(role => {
            console.log(role)
            if (role.name.includes(member.user.username)) {
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
            topic: interaction.member.id,
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
                        const command = require(`./../commands/privaroom/${file}`);
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
    var trovata = false
    try {
        let file = `./Database/${interaction.guild.name}/${type}.json`
        let content = fs.readFileSync(file)
        var parseJson = JSON.parse(content)

        parseJson.list.forEach((x) => {
            if (x.iduser == interaction.member.id) {
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
            if (x.iduser == interaction.member.id) {
                x.channelid1 = channel.id
            }
        })
        console.log(parseJson)
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })
    } else {
        let file = `./Database/${interaction.guild.name}/${type}.json`
        let info = { "iduser": `${interaction.member.id}`, "channelid": `${channel.id}` }
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

function rename(interaction, name, type, type2, type3) {
    let file = `./Database/${interaction.guild.name}/room.json`
    let content = fs.readFileSync(file)
    var parseJson = JSON.parse(content)
    let trovata = false
    let trovata2 = false
    parseJson.list.forEach((x) => {
        if (x.name == interaction.member.id) {
            trovata2 = true
            for (let y in x) {
                if (y != "iduser") {
                    let channel = interaction.guild.channels.cache.get(x[y])
                    if (type) {
                        if (channel.type == type) {
                            trovata = true
                            channel[type2](name).catch(() => {
                                const embed = new Discord.MessageEmbed()
                                    .setTitle("Error")
                                    .setDescription("Ops! Qualcosa è andato storto!!")
                                    .setThumbnail(configs.embed.images.error)
                                    .setColor(configs.embed.color.red)
                                interaction.reply({ embeds: [embed] })
                            })
                        }
                    } else {
                        trovata = true
                        channel[type2](name).catch(() => {
                            const embed = new Discord.MessageEmbed()
                                .setTitle("Error")
                                .setDescription("Ops! Qualcosa è andato storto!!")
                                .setThumbnail(configs.embed.images.error)
                                .setColor(configs.embed.color.red)
                            interaction.reply({ embeds: [embed] })
                        })
                    }
                }
            }
        }
    })

    if (!trovata2) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription("Ops!  Non hai una stanza privata da rinominare creala una <#948323558369669130>")
            .setThumbnail(configs.embed.images.error)
            .setColor(configs.embed.color.red)
        interaction.reply({ embeds: [embed] })
        return
    }
    if (trovata) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Nome Cambiato")
            .setDescription(`Il ${type3} della tua stanza è stato cambiato in ${name}`)
            .setThumbnail(configs.embed.images.succes)
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })
        return
    } else {
        const embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription("Ops!  Non hai una chat testuale!!")
            .setThumbnail(configs.embed.images.error)
            .setColor(configs.embed.color.red)
        interaction.reply({ embeds: [embed] })
        if (type == "GUILD_TEXT") {
            embed = new Discord.MessageEmbed()
                .setDescription("Ops!  Non hai una chat testuale!!")
        }
        if (type == "GUILD_VOICE") {
            embed = new Discord.MessageEmbed()
                .setDescription("Ops!  Non hai una chat testuale!!")
            interaction.reply({ embeds: [embed] })
        }
    }

}


module.exports = {
    write: write,
    dir: dir,
    read: read,
    createchannel: createchannel,
    rename: rename,
    remove: remove
}