const { PermissionsBitField } = require('discord.js')
const cguild = require("./../../setting/guild.json")
const moderationf = require("../../functions/moderation/moderation")
module.exports = {
    name: "mute",
    permisions: [PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.Administrator],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: true,
    test: false,
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
        let utente = interaction.options.getMember("user")
        let reason = interaction.options.getString("reason") || "Nesun motivo"
        moderationf.mutef(interaction, utente, reason)
    }
}