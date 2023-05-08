const { PermissionsBitField } = require('discord.js')
const moderationf = require("../../functions/moderation/moderation")
module.exports = {
    name: "ban",
    permisions: [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.Administrator],
    allowedchannels: global.AllowCommands,
    position: true,
    test: false,
    data: {
        name: "ban",
        description: "banna utente",
        options: [{
            name: "user",
            description: "utente",
            type: 6,
            required: true,
        },
        {
            name: "reason",
            description: "motivo",
            type: 3,
            required: false,
        }]
    },
    async execute(interaction) {
        var utente = interaction.options.getMember("user")
        var reason = interaction.options.getString("reason") || "Nesun motivo"
        moderationf.banf(interaction, utente, reason)

    }
}
