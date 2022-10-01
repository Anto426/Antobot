const { PermissionsBitField } = require('discord.js');
const configs = require("./../../../index")
const errmsg = require("./../../../function/msg/errormsg")
const moderationf = require("../../../function/moderation/moderationfunctions")
module.exports = {
    name: "kick",
    permision: [PermissionsBitField.Flags.KickMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,

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

        var utente = interaction.options.getMember("user")
        var reason = interaction.options.getString("reason") || "Nesun motivo"
        moderationf.kickf(interaction, utente)
    }
}