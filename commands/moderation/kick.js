const { PermissionsBitField } = require('discord.js')
const cguild = require("./../../setting/guild.json")
const moderationf = require("../../functions/moderation/moderation")
module.exports = {
    name: "kick",
    permisions: [PermissionsBitField.Flags.ManageEvents, PermissionsBitField.Flags.Administrator],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: true,
    test: false,
    data: {
        name: "kick",
        description: "espelle utente",
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
    execute(interaction) {
        var utente = interaction.options.getMember("user")
        var reason = interaction.options.getString("reason") || "Nesun motivo"
        moderationf.kickf(interaction, utente, reason)


    }
}  