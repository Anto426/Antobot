const { PermissionsBitField } = require('discord.js')
const cguild = require("./../../setting/guild.json")
const moderationf = require("../../functions/moderation/moderation")
module.exports = {
    name: "unban",
    permisions: [PermissionsBitField.Flags.ManageEvents, PermissionsBitField.Flags.Administrator],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: true,
    test: true,
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
        moderationf.unbanf(interaction,id)

    }
}