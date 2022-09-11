const configs = require("./../../index")
module.exports = {
    name: "cremove",
    permision: [],
    onlyOwner: false,
    onlyStaff: false,
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
        let content = configs.fs.readFileSync(file)
        var parseJson = JSON.parse(content)
        let trovata = false
        parseJson.list.forEach((x) => {
            if (x.name == interaction.member.user.tag) { trovata = true }
        })

        if (!trovata) {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Ops!  Non hai una stanza privata da rinominare creala una <#948323558369669130>")
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        }

        if (!user.roles.cache.has(role.id)) {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Utente gia rimosso dalla stanza")
                .setColor(configs.settings.embed.color.red)
                .setThumbnail(configs.settings.embed.images.error)
            message.channel.send({ embeds: [embed] })
            return
        }

        interaction.guild.channels.cache.forEach(channel => {
            if (channel.topic == name || channel.name.includes(name)) {
                channel.permissionOverwrites.delete(user.user.id);
            }
        });

        user.roles.remove(role).catch(() => { })

        let embed = new configs.Discord.EmbedBuilder()
            .setTitle("Utente rimosso")
            .setDescription("<@" + user.id + ">" + " rimosso dalla stanza")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
        interaction.reply({ embeds: [embed] })




    }
}