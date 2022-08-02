module.exports = {
    name: "untimeout",
    opermision: [],
    onlyOwner: false,
    data: {
        name: "untimeout",
        description: "Rimuove il timeout ad un utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        }]
    },
    execute(interaction) {

        var utente = interaction.options.getMember("user")
        if (utente.user.bot) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`I bot non possono essere applicato il timeout`)
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }

        if (utente.communicationDisabledUntilTimestamp != null || utente.communicationDisabledUntilTimestamp > Date.now()) {

            for (id in configs.owner) {
                if (interaction.member == utente && interaction.member.id != configs.owner[id]) {
                    const embed = new Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(`Ehh bro non puoi togliertelo tu ahh`)
                        .setThumbnail(configs.embed.images.scemo)
                        .setColor(configs.embed.color.red)
                    return interaction.reply({ embeds: [embed] })

                }
            }

            utente.timeout(null)
            const embed = new Discord.EmbedBuilder()
                .setTitle("Utente untimeoutato")
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setDescription("<@" + utente + ">" + " untimeoutato")
                .setColor(configs.embed.color.green)
            interaction.reply({ embeds: [embed] })

        } else {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`${utente.toString()} non ha un timeout!`)
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
        }



    }
}