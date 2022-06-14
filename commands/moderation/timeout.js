
function times(millis) {
    var minutes = Math.floor(millis / 60000).toFixed(0);
    var hour = 0
    var day = 0
    if (minutes >= 60) {
        do {
            hour = hour + 1
            minutes = minutes - 60
        } while (minutes >= 60)
    }
    if (hour >= 24) {
        do {
            day = day + 1
            hour = hour - 24
        } while (hour >= 24)

    }
    return day + "d :" + hour + " h:" + minutes + " m"
}

module.exports = {
    name: "timeout",
    onlyStaff: true,
    onlyOwner: false,
    data: {
        name: "timeout",
        description: "timeout utente",
        options: [
            {
                name: "user",
                description: "L'utente interessato",
                type: "USER",
                required: true
            },
            {
                name: "time",
                description: "tempo",
                type: "NUMBER",
                required: true
            },
            {
                name: "reason",
                description: "motivo",
                type:"STRING",
                required: false
            }
        ]
    },
    execute(interaction) {

        var utente = interaction.options.getMember("user")
        var time = interaction.options.getNumber("time") * 1000 * 60
        var reason = interaction.options.getString("reason")||"Nesun motivo"
        if(utente.user.bot){
            const embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription(`Non posso applicare il timeout ai bot `)
            .setThumbnail(configs.embed.images.error)
            .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed]})

        }
        if(interaction.member == utente){
            const embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription(`Tutto bene bro ti voi applicare il timeout da solo ?!`)
            .setThumbnail(configs.embed.images.scemo)
            .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed]})

        }
            if(utente.communicationDisabledUntilTimestamp == null){

        
              
                utente.timeout(time,reason).catch(() => {
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription("Qualcosa è andato storto o hai messo un tempo troppo lungo")
                        .setThumbnail(configs.embed.images.error)
                        .setColor(configs.embed.color.red)
                        interaction.channel.send({ embeds: [embed] })
                    return
        
                })
                const embed = new Discord.MessageEmbed()
                .setTitle("Utente timeoutato")
                .addField("Reason",`\`\`\`js\n ${reason} \`\`\``,true)
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .setDescription("<@" + utente + ">" + " timeoutato per " + times(time))
                .setColor(configs.embed.color.green)
                interaction.reply({ embeds: [embed] })

            }else{
                const d = new Date( utente.communicationDisabledUntilTimestamp );
date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
console.log( date );
                const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(`${utente.toString()} ha già un timeout!`)
                .addField("Fino a :",`\`\`\`js\n ${date} \`\`\``)
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
                interaction.reply({ embeds: [embed] })
            }

 

    }
}