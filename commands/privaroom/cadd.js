module.exports = {
    name: "cadd",
    permision: [],
    onlyOwner: false,
    onlyStaff : false,
    data: {
        name: "cadd",
        description: "Aggiugere utente alle stanze private",
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

        if (user.roles.cache.has(role.id)) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Utente gia aggiunto alla stanza")
                .setColor(configs.embed.color.red)
                .setThumbnail(configs.embed.images.error)
            interaction.reply({ embeds: [embed] })
            return
        }

        interaction.guild.channels.cache.forEach(channel => {
            if (channel.topic == name || channel.name.includes(name)) {
                channel.permissionOverwrites.edit(user.user.id, { VIEW_CHANNEL: true });
            }
        });
        user.roles.add(role).catch(() => {})

        let embed = new Discord.EmbedBuilder()
            .setTitle("Utente Aggiunto")
            .setDescription("<@" + user.id + ">" + " aggiunto alla stanza")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })
    }
}