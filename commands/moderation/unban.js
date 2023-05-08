const { PermissionsBitField } = require('discord.js')
const moderationf = require("../../functions/moderation/moderation")
module.exports = {
    name: "unban",
    permisions: [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.Administrator],
    allowedchannels: global.AllowCommands,
    position: true,
    test: false,
    data: {
        name: "unban",
        description: "Unban utente",
        options: [{
            name: "iduser",
            description: "id dell'utente interessato",
            type: 3,
            required: true
        }]
    },
    execute(interaction) {
        let id = interaction.options.getString("iduser")
        moderationf.unbanf(interaction, id)

    }
}