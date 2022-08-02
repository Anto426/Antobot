const { inspect } = require(`util`)
let functions = require("../../../function/time/timefunctions")
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
                type: 6,
                required: true
            },
            {
                name: "time",
                description: "tempo",
                type: 10,
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
                type: 3,
                required: false
            },

        ]
    },
    execute(interaction) {

        var utente = interaction.options.getMember("user")
        var time = interaction.options.getNumber("time") * 1000 * 60
        var reason = interaction.options.getString("reason") || "Nesun motivo"
        if (utente.user.bot) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`Non posso applicare il timeout ai bot `)
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }
        if (interaction.member == utente) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`Tutto bene bro ti voi applicare il timeout da solo ?!`)
                .setThumbnail(configs.embed.images.scemo)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }
        if (utente.communicationDisabledUntilTimestamp == null || utente.communicationDisabledUntilTimestamp < Date.now()) {




            utente.timeout(time, reason).catch((err) => {
                const embed = new Discord.EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("Qualcosa è andato storto")
                    .addFields([
                        { name: 'Error', value: `\`\`\`js\n ${inspect((err.toString()))}  \`\`\``},
                    ])
                    .setThumbnail(configs.embed.images.error)
                    .setColor(configs.embed.color.red)
                interaction.channel.send({ embeds: [embed] })
                return

            })
            const embed = new Discord.EmbedBuilder()
                .setTitle("Utente timeoutato")
                .addFields([
                    { name: 'Reason', value: `\`\`\`js\n ${reason} \`\`\`` },
                ])
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setDescription("<@" + utente + ">" + " timeoutato per " + functions.times(time))
                .setColor(configs.embed.color.green)
            interaction.reply({ embeds: [embed] })

        } else {
            const d = new Date(utente.communicationDisabledUntilTimestamp);
            date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
            console.log(date);
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`${utente.toString()} ha già un timeout!`)
                .addFields([
                    { name: 'Fino a :', value: `\`\`\`js\n ${date} \`\`\`` },
                ])
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
        }

    }
}