const { inspect } = require(`util`)
const { PermissionsBitField } = require('discord.js');
const timefunctions = require("../../../function/time/timefunctions")
const configs = require("./../../../index")
const errmsg = require("./../../../function/msg/errormsg")
module.exports = {
    name: "timeout",
    permision: [PermissionsBitField.Flags.ModerateMembers],
    onlyOwner: false,
    onlyStaff: false,
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
            errmsg.botmsg(interaction)

        }
        if (utente.communicationDisabledUntilTimestamp == null || utente.communicationDisabledUntilTimestamp < Date.now()) {




            utente.timeout(time, reason).catch((err) => {
                errmsg.genericmsg(interaction)
                return

            })
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Utente timeoutato")
                .addFields([
                    { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
                ])
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setDescription("<@" + utente + ">" + " timeoutato per " + timefunctions.times(time))
                .setColor(configs.settings.embed.color.green)
            interaction.reply({ embeds: [embed] })

        } else {
            const d = new Date(utente.communicationDisabledUntilTimestamp);
            date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
            console.log(date);
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`${utente.toString()} ha già un timeout!`)
                .addFields([
                    { name: 'Fino a :', value: `\`\`\`\n ${date} \`\`\`` },
                ])
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            interaction.reply({ embeds: [embed] })
        }

    }
}