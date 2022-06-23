function remove(arr, elem) {
    temp = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != elem)
            temp.push(arr[i])
    }
    return temp;
}

function dir(interaction) {

    let directory = `./Database/${interaction.guild.name}`
    try {
        fs.lstatSync(directory).isDirectory()
    } catch {
        const path = require('path');


        fs.mkdir(path.join(`./Database/`, interaction.guild.name), (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
        });
    }
}

function write(interaction, type) {


    let file = `./Database/${interaction.guild.name}/${type}.js`
    const name = interaction.member.user.tag
    try {
        fs.lstatSync(file).isFile().catch((err) => {
            console.log(err)
        })
        fs.readFile(file, async function(err, content) {
            if (err) throw err;

            fs.lstatSync(file).isFile()
            var parseJson = JSON.parse(content);

            for (number in parseJson.list) {
                if (parseJson.list[number] == name) {
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription("Impossibile aprirela stanza ne hai già una")
                        .setColor("#Ff2400")
                        .setThumbnail("https://i.imgur.com/5dNAgln.gif")
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                    return
                }
            }
        })
    } catch {
        parseJson.list.push(`${name}`, )
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })

        let parseJson = `{[""]}`
        parseJson.list.push(`${name}`, )
        fs.writeFile(file, JSON.stringify(parseJson), function(err) {
            if (err) throw err;
        })
    }


}



module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

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

            interaction.reply({ content: "funzione disabilitata", ephemeral: true })
        }
        if (interaction.customId == "onlytext" || interaction.customId == "onlyvoice" || interaction.customId == "text+voice") {

            interaction.reply({ content: "funzione disabilitata", ephemeral: true })
        }

        /*       if (interaction.customId == "opentiket") {

                   let types = "tiket"
                   let category = client.channels.cache.get(configs[interaction.guild.name].stanze.tiket)
                   let channelname = "「🎫」" + interaction.member.user.tag
                   dir(interaction)
                   write(interaction, types)
                   let tiket = await interaction.guild.channels.create(channelname, {
                       type: 'GUILD_TEXT',
                       parent: category,
                       topic: [interaction.member.user.tag],
                       permissionOverwrites: [{
                           id: interaction.member.id,
                           allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                       }, {
                           id: interaction.member.guild.roles.everyone,
                           deny: ["VIEW_CHANNEL"]
                       }]
                   })
                   let embed = new Discord.MessageEmbed()
                       .setTitle("hey ciao ci dispiace che hai avuto problemi!")
                       .setDescription("<@" + interaction.member + ">" + " tiket creato con succeso alle ore " + hour + ":" + minutes + " attendi che lo staff ti risponda")
                       .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                       .setColor("#51ff00")
                   let row = new MessageActionRow()
                       .addComponents(
                           new MessageButton()
                           .setCustomId('closedtiket')
                           .setStyle('DANGER')
                           .setLabel('chiudi il ticket'),
                       );
                   tiket.send({ embeds: [embed], components: [row] })
                   let embed1 = new Discord.MessageEmbed()
                       .setTitle("tiket creato")
                       .setDescription("ticket creato con succeso alle ore " + hour + ":" + minutes + " attendi che lo staff ti risponda")
                       .setThumbnail("https://i.imgur.com/d7GeRKz.gif")
                       .setColor("#51ff00")
                   interaction.reply({
                       embeds: [embed1],
                       ephemeral: true
                   })





               }*/



    }




}