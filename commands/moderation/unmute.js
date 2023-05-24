const { PermissionsBitField } = require('discord.js')
const moderationf = require("../../functions/moderation/moderation")
module.exports = {
    name: "unmute",
    permisions: [PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.Administrator],
    allowedchannels: global.AllowCommands,
    position: true,
    test: false,
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
        let utente = interaction.options.getMember("user")
        moderationf.unmute(interaction, utente)

    }
}