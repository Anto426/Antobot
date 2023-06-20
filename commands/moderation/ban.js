const { PermissionsBitField } = require("discord.js")
const cguild = require("./../../settings/guild.json")
const { genericerr } = require("../../embeds/err/generic")
const { banf } = require("../../functions/moderation/ban")
module.exports = {
    name: "ban",
    permisions: [PermissionsBitField.Flags.BanMembers],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: true,
    test: false,
    data: {
        name: "ban",
        description: "Banna utente",
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
            var utente = interaction.options.getMember("user")
            var reason = interaction.options.getString("reason") || "Nesun motivo"
            banf(interaction, utente, reason)
        } catch (err) { genericerr(interaction, err) }
    }
}