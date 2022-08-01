module.exports = {
    name: "ban",
    onlyStaff: true,
    onlyOwner: false,
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
        if (interaction.member == utente) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`Tutto bene bro ti voi bannare da solo ?!`)
                .setThumbnail(configs.embed.images.scemo)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        }
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
                .addField("Reason", `\`\`\`js\n ${reason} \`\`\``, true)
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setColor(configs.embed.color.green)
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