const { PermissionsBitField } = require('discord.js');
const configs = require("./../../../index")
const errmsg = require("./../../../function/error/errormsg")
const moderationf = require("../../../function/moderation/moderationfunctions")
module.exports = {
    name: "kick",
    permision: [PermissionsBitField.Flags.KickMembers],
    onlyOwner: false,
    onlyStaff: false,

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

        if (!utente.kickable) {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(` Non ho il permesso di cacciare ${utente} è troppo forte`)
                .setThumbnail(configs.settings.embed.images.forte)
                .setColor(configs.settings.embed.color.red)
            return interaction.reply({ embeds: [embed] })
        }

        moderationf.kickf(interaction,utente)
    }
}