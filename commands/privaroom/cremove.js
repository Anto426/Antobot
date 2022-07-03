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
            type: "USER",
            required: true
        }]
    },
    execute(interaction) {

        var user = interaction.options.getMember("user")
        let name = interaction.member.user.tag
        let role = interaction.guild.roles.cache.find(x => x.name.includes(name))

        if (!user.roles.cache.has(role.id)) {
            const embed = new Discord.MessageEmbed()
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

        let embed = new Discord.MessageEmbed()
            .setTitle("Utente rimosso")
            .setDescription("<@" + user.id + ">" + " rimosso dalla stanza")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })




    }
}