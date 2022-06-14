module.exports = {
    name: "mute",
    onlyStaff: true,
    onlyOwner: false,
    data: {
        name: "mute",
        description: "mute utente",
        options: [
            {
                name: "user",
                description: "L'utente interessato",
                type: "USER",
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
    async execute(interaction) {
        var utente = interaction.options.getMember("user")
        var reason = interaction.options.getString("reason")||"Nesun motivo"

        if(utente.user.bot){
            const embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription(`Non posso mutare/smutare i bot `)
            .setThumbnail(configs.embed.images.error)
            .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed]})

        }
        if(interaction.member == utente){
            const embed = new Discord.MessageEmbed()
            .setTitle("Error")
            .setDescription(`Tutto bene bro ti voi mutarti  da solo ?!`)
            .setThumbnail(configs.embed.images.scemo)
            .setColor(configs.embed.color.red)
            return interaction.reply({ embeds: [embed]})

        }

        let muted = interaction.guild.roles.cache.find(x=> x.name == "MutedA")
        if(!muted){
            muted = await interaction.guild.roles.create({
                name: "MutedA",
                permissions: [""]
            })
            interaction.guild.channels.cache.forEach(channel => {
                channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false })
            });
        }


        if (!utente.kickable) {
            const embed = new Discord.MessageEmbed()
                .setTitle(interaction.member.user.tag + " Error")
                .setDescription("Non ho il permesso di mutarlo è troppo forte")
                .setThumbnail(configs.embed.images.forte)
                .setColor(configs.embed.color.red)
                interaction.reply({ embeds: [embed] })
            return
        }
        if (utente.roles.cache.has(muted.id)) {
            const embed = new Discord.MessageEmbed()
                .setTitle(interaction.member.user.tag + " Error")
                .setDescription(utente.user.tag + " risulta già mutato")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
                interaction.reply({ embeds: [embed] })
            return
        }
        const embed = new Discord.MessageEmbed()
            .setTitle("Utente mutato")
            .addField("Reason", `\`\`\`js\n ${reason} \`\`\``, true)
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + utente + ">" + " mutato")
            .setColor(configs.embed.color.green)
            interaction.reply({ embeds: [embed] })
        utente.roles.add(muted).catch(() => {})






 

    }
}