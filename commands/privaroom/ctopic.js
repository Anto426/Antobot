module.exports = {
    name: "ctopics",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "ctopics",
        description: "Cambia il topic della stanza testuale",
        options: [{
            name: "topic",
            description: "Nuovo nome ",
            type: "STRING",
            required: true
        }]
    },
    execute(interaction) {

        let topic = interaction.options.getString("topic")
        console.log(topic)

        let file = `./Database/${interaction.guild.name}/room.json`
        let content = fs.readFileSync(file)
        var parseJson = JSON.parse(content)
        let trovata = false
        let trovata2 = false
        parseJson.list.forEach((x) => {
            if (x.name == interaction.member.user.tag) {
                trovata2 = true
                for (let y in x) {
                    if (y != "name") {
                        let channel = interaction.guild.channels.cache.get(x[y])
                        if (channel.type == "GUILD_TEXT") {
                            trovata = true
                            channel.setTopic(topic).catch(() => {
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
                .setTitle("Topic Cambiato")
                .setDescription(`Il topic della tua stanza è stato cambiato in ${topic}`)
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
            return

        }
    }
}