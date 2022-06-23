module.exports = {
    name: "untimeout",
    onlyStaff: true,
    onlyOwner: false,
    data: {
        name: "untimeout",
        description: "untimeout utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: "USER",
            required: true
        }]
    },
    execute(interaction) {

        var utente = interaction.options.getMember("user")
        if (utente.user.bot) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(`I bot non possono essere applicato il timeout`)
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }

        if (utente.communicationDisabledUntilTimestamp != null) {

            for (id in configs.owner) {
                if (interaction.member == utente && interaction.member.id != configs.owner[id]) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription(`Ehh bro non puoi togliertelo tu ahh`)
                        .setThumbnail(configs.embed.images.scemo)
                        .setColor(configs.embed.color.red)
                    return interaction.reply({ embeds: [embed] })

                }
            }

            utente.timeout(null)
            const embed = new Discord.MessageEmbed()
                .setTitle("Utente untimeoutato")
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setDescription("<@" + utente + ">" + " untimeoutato")
                .setColor(configs.embed.color.green)
            interaction.reply({ embeds: [embed] })

        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(`${utente.toString()} non ha un timeout!`)
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
        }



    }
}