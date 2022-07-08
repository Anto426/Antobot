module.exports = {
    name: "serverinfo",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "serverinfo",
        description: "Informazioni sul server"
    },
    async execute(interaction) {
        var server = interaction.member.guild;
        let countingonline = await server.members.cache.filter(x => x.presence?.status == 'online').size
        let countingidle = await server.members.cache.filter(x => x.presence?.status == 'idle').size

        const embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setColor(configs.embed.color.green)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL({ dynamic: true }))
            .setDescription(`Tutte le info su questo server`)
            .addField(`Owner:`,`\`\`\`\n${server.members.cache.get(server.ownerId).nickname}\`\`\``)
            .addField(`Livello di verifica:`,`\`\`\`\nAlto\`\`\``)
            .addField(`Server id:`,`\`\`\`\n${server.id}\`\`\``)
            .addField(`Members:`,` \`\`\`\n

Membri tot: ${server.memberCount.toString()}

Bot:${server.members.cache.filter(x => x.user.bot).size.toString()}

Utenti:${server.members.cache.filter(x=> !x.user.bot).size.toString()}

online: ${countingonline + countingidle}


\`\`\``)

.addField(`Channels:`,`\`\`\`\n

Canali tot:${server.channels.cache.filter(x=> x.type == "GUILD_VOICE" || x.type == "GUILD_TEXT").size.toString()}

Canali vocali:${server.channels.cache.filter(x=> x.type == "GUILD_VOICE").size.toString()} || Canali testuali: ${server.channels.cache.filter(x=> x.type == "GUILD_TEXT").size.toString()}

\`\`\``)

.addField( `Server created`, `\`\`\`\n${server.createdAt.toDateString()}\`\`\` `) 

.addField(`Boost level Level`, `\`\`\`\n${(server.premiumTier != "NONE" ? server.premiumTier : 0) + " (Boost: " + server.premiumSubscriptionCount + ")"} \`\`\``)


        interaction.reply({ embeds: [embed] })
    }
}