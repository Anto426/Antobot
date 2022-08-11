const { PermissionsBitField } = require('discord.js');
module.exports = {
    name: "ban",
    permision: [PermissionsBitField.Flags.BanMembers],
    onlyOwner: false,
    onlyStaff : false,

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
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(` Non ho il permesso di cacciare ${utente} è troppo forte`)
                .setThumbnail(configs.embed.images.forte)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })
        }



        try {
            utente.ban({
                reason: reason
            });
            const embed = new Discord.EmbedBuilder()
                .setTitle("Utente bannato")
                .setDescription("<@" + utente + ">" + " bannato")
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setColor(configs.embed.color.green)
                .addFields([
                    { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
                ])
            interaction.reply({ embeds: [embed] })
        } catch {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Ops! Qualcosa è andato storto!!")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
        }


    }
}