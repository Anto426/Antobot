const { PermissionsBitField } = require('discord.js')
const moderationf = require("../../functions/moderation/moderation")
module.exports = {
    name: "untimeout",
    permisions: [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.Administrator],
    allowedchannels: global.AllowCommands,
    position: true,
    test: false,
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
        moderationf.untimioutf(interaction, utente)

    }
}