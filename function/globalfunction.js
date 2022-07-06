// ver dir 
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













async function write(interaction, type, channel, type2) {
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

    if (type == "room") {

        interaction.guild.roles.cache.forEach(role => {
            if (role.name.includes(interaction.member.user.tag)) {
                role.delete()
            }
        });

    }

}

module.exports = {

    remove: remove,
    read: read,
    write: write,
    dir: dir,
    createchannel: createchannel
}