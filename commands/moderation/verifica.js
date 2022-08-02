module.exports = {
    name: "verifica",
    opermision: [],
    onlyOwner: false,
    data: {
        name: "verifica",
        description: "Verifica utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        }]
    },
    execute(interaction) {
        var utente = interaction.options.getMember("user")

        console.log(utente.roles.cache.size)
        if (utente.roles.cache.size == 1) {

            for (let id in configs[interaction.guild.name].role.rolebase) {
                let role = interaction.guild.roles.cache.find(x => x.id == configs[interaction.guild.name].role.rolebase[id])
                utente.roles.add(role).catch(() => {})

            }

            verifica = true
            const embed = new Discord.EmbedBuilder()
                .setTitle(utente.user.tag + " verificato")
                .setDescription("verifica completata con succeso alle ore " + new Date().getHours() + ":" + new Date().getMinutes())
                .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
                .setColor(configs.embed.color.green)
            interaction.reply({ embeds: [embed] })

            const embed1 = new Discord.EmbedBuilder()
                .setTitle(utente.user.tag + " verificato")
                .setDescription(utente.user.tag + " sei stato verificato alle  ore " + new Date().getHours() + ":" + new Date().getMinutes() + " da " + interaction.member.user.tag)
                .setThumbnail(configs.embed.images.succes)
                .setColor(configs.embed.color.green)
            utente.send({ embeds: [embed1] }).catch(() => {

                const embed1 = new Discord.EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("impossibile informare l'utente in dm")
                    .setThumbnail(configs.embed.images.error)
                    .setColor(configs.embed.color.green)
                interaction.channel.send({ embeds: [embed] })


            })






        }



    }
}