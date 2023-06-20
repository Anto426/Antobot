const { PermissionsBitField } = require('discord.js');
const { genericerr } = require('../../embeds/err/generic');
const { unmutef } = require('../../functions/moderation/mute');
const cguild = require("./../../settings/guild.json")
module.exports = {
    name: "unmute",
    permisions: [PermissionsBitField.Flags.ModerateMembers],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: true,
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
        try {
            var utente = interaction.options.getMember("user")
            unmutef(interaction, utente)
        } catch (err) { genericerr(interaction, err) }
    }
}