module.exports = {
    name: "crenamevoice",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "crenamevoice",
        description: "Rinomina stanza testuale",
        options: [{
            name: "name",
            description: "Nuovo nome ",
            type: "STRING",
            required: true
        }]
    },
    execute(interaction) {

        let name = interaction.options.getString("name")

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
                        if (channel.type == "GUILD_VOICE") {
                            trovata = true
                            channel.setName(name).catch(() => {
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
                .setDescription(`Il nome della tua stanza è stato cambiato in ${name}`)
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