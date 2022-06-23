module.exports = {
    name: "kick",
    onlyStaff: true,
    onlyOwner: false,
    data: {
        name: "kick",
        description: "kick utente",
        options: [{
                name: "user",
                description: "L'utente interessato",
                type: "USER",
                required: true
            },
            {
                name: "reason",
                description: "motivo",
                type: "STRING",
                required: false
            }
        ]
    },
    execute(interaction) {

        var utente = interaction.options.getMember("user")
        var reason = interaction.options.getString("reason") || "Nesun motivo"
        if (interaction.member == utente) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(`Tutto bene bro ti voi kikare da solo ?!`)
                .setThumbnail(configs.embed.images.scemo)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }
        if (!utente.kickable) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(` Non ho il permesso di cacciare ${utente} è troppo forte`)
                .setThumbnail(configs.embed.images.forte)
                .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed] })
        }
        try {
            utente.kick();
            const embed = new Discord.MessageEmbed()
                .setTitle("Utente bannato")
                .setDescription("<@" + utente + ">" + " kickato")
                .addField("Reason", `\`\`\`js\n ${reason} \`\`\``, true)
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setColor(configs.embed.color.green)
            interaction.reply({ embeds: [embed] })
        } catch (err) {
            console.log(err)
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription("Ops! Qualcosa è andato storto!!")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed] })
        }


    }
}