const { PermissionsBitField } = require('discord.js');
const { untimioutf } = require('../../../function/moderation/moderationfunctions');
const configs = require("./../../../index")
module.exports = {
    name: "untimeout",
    permision: [PermissionsBitField.Flags.ModerateMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,
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
        untimioutf(interaction, utente)



    }
}