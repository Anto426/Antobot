module.exports = {
    name: "cadd",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "cadd",
        description: "aggiungi utente dalla stanza privata",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: "USER",
            required: true
        }]
    },
    execute(interaction) {

        var user = interaction.options.getMember("user")
        let name = interaction.member.user.tag
        let role = interaction.guild.roles.cache.find(x => x.name.includes(name))
        if (user.roles.cache.has(role.id)) {
            const embed = new Discord.MessageEmbed()
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

        let embed = new Discord.MessageEmbed()
            .setTitle("Utente Aggiunto")
            .setDescription("<@" + user.id + ">" + " aggiunto alla stanza")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })
    }
}