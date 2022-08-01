module.exports = {
    name: "unban",
    onlyStaff: true,
    onlyOwner: false,
    data: {
        name: "unban",
        description: "Unban utente",
        options: [{
            name: "iduser",
            description: "id dell'utente interessato",
            type: 3,
            required: true
        }]
    },
    execute(interaction) {

        var id = interaction.options.getString("iduser")
        let a = true
        try {
            interaction.guild.bans.fetch().then(banned => {
                banned.forEach(element => {
                    if (element.user.id.toString() == id)
                        a = false
                })
            }).then(x => {

                if (!a) {
                    interaction.guild.members.unban(id)
                    const embed = new Discord.EmbedBuilder()
                        .setTitle("Utente sbannato")
                        .setDescription("Utente sbannato")
                        .setThumbnail(configs.embed.images.succes)
                        .setColor(configs.embed.color.green)
                    interaction.reply({ embeds: [embed] })
                } else {
                    const embed = new Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Utente gia sbannato")
                        .setThumbnail(configs.embed.images.error)
                        .setColor(configs.embed.color.red)
                    interaction.reply({ embeds: [embed] })
                }
            })
            return
        } catch {
            const embed = new Discord.EmbedBuilder()
                .setTitle(message.member.user.tag + " Error")
                .setDescription("Ops! Qualcosa è andato storto!!")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            message.channel.send({ embeds: [embed] })
        }


    }
}