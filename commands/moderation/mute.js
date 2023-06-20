const { PermissionsBitField } = require('discord.js');
const { genericerr } = require('../../embeds/err/generic');
const cguild = require("./../../settings/guild.json")
const { mutef } = require('../../functions/moderation/mute');
module.exports = {
    name: "mute",
    permisions: [PermissionsBitField.Flags.ModerateMembers],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
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
        try {
            var utente = interaction.options.getMember("user")
            var reason = interaction.options.getString("reason") || "Nesun motivo"
            mutef(interaction, utente, reason)
        } catch (err) { genericerr(interaction, err) }
    }
}