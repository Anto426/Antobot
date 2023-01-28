const { PermissionsBitField } = require('discord.js')
const cguild = require("./../../setting/guild.json")
const moderationf = require("../../functions/moderation/moderation")
module.exports = {
    name: "unmute",
    permisions: [PermissionsBitField.Flags.ManageEvents, PermissionsBitField.Flags.Administrator],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: false,
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
        var utente = interaction.options.getMember("user")
        moderationf.unmute(interaction, utente)

    }
}