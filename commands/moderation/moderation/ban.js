const { PermissionsBitField } = require('discord.js');
const configs = require("./../../../index")
const errmsg = require("./../../../function/error/errormsg")
const moderationf = require("../../../function/moderation/moderationfunctions")
module.exports = {
    name: "ban",
    permision: [PermissionsBitField.Flags.BanMembers],
    onlyOwner: false,
    onlyStaff: false,

    data: {
        name: "ban",
        description: "Banna utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 3,
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
        if (!utente.bannable) {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(` Non ho il permesso di cacciare ${utente} è troppo forte`)
                .setThumbnail(configs.settings.embed.images.forte)
                .setColor(configs.settings.embed.color.red)
            return interaction.reply({ embeds: [embed] })
        }

        moderationf.banf(interaction,utente)






    }
}