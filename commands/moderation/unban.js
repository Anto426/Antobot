const { PermissionsBitField } = require('discord.js');
const { genericerr } = require('../../embeds/err/generic');
const { unbanf } = require('../../functions/moderation/ban');
const cguild = require("./../../settings/guild.json")
module.exports = {
    name: "unban",
    permisions: [PermissionsBitField.Flags.ModerateMembers],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
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
        try {
            var id = interaction.options.getString("iduser")
            unbanf(interaction,id)

        } catch (err) { genericerr(interaction, err) }

    }
}