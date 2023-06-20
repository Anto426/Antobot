const { PermissionsBitField } = require('discord.js');
const cguild = require("./../../settings/guild.json");
const { genericerr } = require('../../embeds/err/generic');
const { kickf } = require('../../functions/moderation/kick');
module.exports = {
    name: "kick",
    permisions: [PermissionsBitField.Flags.KickMembers],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: true,
    test: false,
    data: {
        name: "kick",
        description: "Espelle utente ",
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
    execute(interaction) {
        try {
            var member = interaction.options.getMember("user")
            var reason = interaction.options.getString("reason") || "Nesun motivo"
            kickf(interaction, member, reason)
        } catch (err) { genericerr(interaction, err) }
    }
}