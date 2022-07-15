function times(millis) {
    var minutes = Math.floor(millis / 60000).toFixed(0);
    var hour = 0
    var day = 0
    if (minutes >= 60) {
        do {
            hour = hour + 1
            minutes = minutes - 60
        } while (minutes >= 60)
    }
    if (hour >= 24) {
        do {
            day = day + 1
            hour = hour - 24
        } while (hour >= 24)

    }
    return day + "d :" + hour + " h:" + minutes + " m"
}

module.exports = {
    name: "timeout",
    onlyStaff: true,
    onlyOwner: false,
    data: {
        name: "timeout",
        description: "Applica il timeout ad un utente",
        options: [{
                name: "user",
                description: "L'utente interessato",
                type: "USER",
                required: true
            },
            {
                name: "time",
                description: "tempo",
                type: "NUMBER",
                required: true,
                choices: [{
                        name: "1 min",
                        value: 1
                    }, {
                        name: "2 min",
                        value: 2
                    }, {
                        name: "5 min",
                        value: 5
                    },
                    {
                        name: "10 min",
                        value: 10
                    }, {
                        name: "15 min",
                        value: 15
                    }, {
                        name: "30 min",
                        value: 30
                    }, {
                        name: "1 h",
                        value: 60
                    }, {
                        name: "2 h",
                        value: 120
                    }, {
                        name: "1 d",
                        value: 1440
                    }, {
                        name: "1 settimana ",
                        value: 10080
                    }
                ]
            },
            {
                name: "reason",
                description: "motivo",
                type: "STRING",
                required: false
            },

        ]
    },
    execute(interaction) {

        var utente = interaction.options.getMember("user")
        var time = interaction.options.getNumber("time") * 1000 * 60
        var reason = interaction.options.getString("reason") || "Nesun motivo"
        if (utente.user.bot) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(`Non posso applicare il timeout ai bot `)
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }
        if (interaction.member == utente) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(`Tutto bene bro ti voi applicare il timeout da solo ?!`)
                .setThumbnail(configs.embed.images.scemo)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }
        console.log(utente.timeouted)




        utente.timeout(time, reason).catch(() => {
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription("Qualcosa è andato storto")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.channel.send({ embeds: [embed] })
            return

        })
        const embed = new Discord.MessageEmbed()
            .setTitle("Utente timeoutato")
            .addField("Reason", `\`\`\`js\n ${reason} \`\`\``, true)
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + utente + ">" + " timeoutato per " + times(time))
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })



    }
}