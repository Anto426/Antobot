const { PermissionsBitField } = require('discord.js');
const { unmute } = require('../../../function/moderation/moderationfunctions');
const configs = require("./../../../index")
module.exports = {
    name: "unmute",
    permision: [PermissionsBitField.Flags.MuteMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,
    data: {
        name: "unmute",
        description: "Smuta utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        }]
    },
    async execute(interaction) {
        var utente = interaction.options.getMember("user")
        unmute(interaction,utente)

    }
}