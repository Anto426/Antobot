const { PermissionsBitField } = require('discord.js');
const { mutef } = require('../../../function/moderation/moderationfunctions');
const configs = require("./../../../index")
module.exports = {
    name: "mute",
    permision: [PermissionsBitField.Flags.MuteMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,
    data: {
        name: "mute",
        description: "Muta utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "motivo",
            type: 3,
            required: false
        }
        ]
    },
    async execute(interaction) {
        var utente = interaction.options.getMember("user")
        var reason = interaction.options.getString("reason") || "Nesun motivo"
        mutef(interaction,utente,reason)
    }
}