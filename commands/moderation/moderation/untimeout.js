const { PermissionsBitField } = require('discord.js');
const configs = require("./../../../index")
module.exports = {
    name: "untimeout",
    permision: [PermissionsBitField.Flags.ModerateMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,
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

        var utente = interaction.options.getMember("user")
        if (utente.user.bot) {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`I bot non possono essere applicato il timeout`)
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }

        if (utente.communicationDisabledUntilTimestamp != null || utente.communicationDisabledUntilTimestamp > Date.now()) {

            for (id in configs.settings.owner) {
                if (interaction.member == utente && interaction.member.id != configs.settings.owner[id]) {
                    const embed = new configs.Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(`Ehh bro non puoi togliertelo tu ahh`)
                        .setThumbnail(configs.settings.embed.images.scemo)
                        .setColor(configs.settings.embed.color.red)
                    return interaction.reply({ embeds: [embed] })

                }
            }

            utente.timeout(null)
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Utente untimeoutato")
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setDescription("<@" + utente + ">" + " untimeoutato")
                .setColor(configs.settings.embed.color.green)
            interaction.reply({ embeds: [embed] })

        } else {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`${utente.toString()} non ha un timeout!`)
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            interaction.reply({ embeds: [embed] })
        }



    }
}