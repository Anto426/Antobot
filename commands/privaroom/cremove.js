module.exports = {
    name: "cremove",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "cremove",
        description: "Rimuovere utente dalle stanze private",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        }]
    },
    execute(interaction) {

        var user = interaction.options.getMember("user")
        let name = interaction.member.user.tag
        let role = interaction.guild.roles.cache.find(x => x.name.includes(name))


        let file = `./Database/${interaction.guild.name}/room.json`
        let content = fs.readFileSync(file)
        var parseJson = JSON.parse(content)
        let trovata = false
        parseJson.list.forEach((x) => {
            if (x.name == interaction.member.user.tag) { trovata = true }
        })

        if (!trovata) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Ops!  Non hai una stanza privata da rinominare creala una <#948323558369669130>")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        }

        if (!user.roles.cache.has(role.id)) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Utente gia rimosso dalla stanza")
                .setColor(configs.embed.color.red)
                .setThumbnail(configs.embed.images.error)
            message.channel.send({ embeds: [embed] })
            return
        }

        interaction.guild.channels.cache.forEach(channel => {
            if (channel.topic == name || channel.name.includes(name)) {
                channel.permissionOverwrites.delete(user.user.id);
            }
        });

        user.roles.remove(role).catch(() => {})

        let embed = new Discord.EmbedBuilder()
            .setTitle("Utente rimosso")
            .setDescription("<@" + user.id + ">" + " rimosso dalla stanza")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })




    }
}