const { inspect } = require(`util`)
const { PermissionsBitField } = require('discord.js');
const { timeoutf } = require('../../../function/moderation/moderationfunctions');
module.exports = {
    name: "timeout",
    permision: [PermissionsBitField.Flags.ModerateMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,
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
        timeoutf(interaction,utente,reason)

    }
}