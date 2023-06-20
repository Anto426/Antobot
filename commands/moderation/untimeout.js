const { PermissionsBitField } = require('discord.js');
const { genericerr } = require('../../embeds/err/generic');
const { untimioutf } = require('../../functions/moderation/timeout');
const cguild = require("./../../settings/guild.json")
module.exports = {
    name: "untimeout",
    permisions: [PermissionsBitField.Flags.ModerateMembers],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
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
        try {
            var utente = interaction.options.getMember("user")
            untimioutf(interaction, utente)
        } catch (err) { genericerr(interaction, err) }


    }
}