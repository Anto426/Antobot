module.exports = {
    name: "serverinfo",
    onlyStaff: false,
    data: {
        name: "serverinfo",
        description: "info sul server"
    },
    execute(interaction) {
        var server = interaction.member.guild;

        const embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL({ dynamic: true }))
            .addField("Owner", `\`\`\`js\n ${server.members.cache.get(server.ownerId).nickname} \`\`\``, true)
            .addField("Livello di verifica", `\`\`\`js\n Alto \`\`\``, true)
            .addField("Server id", `\`\`\`js\n ${server.id} \`\`\``, true)
            .addField("Members", `\`\`\`js\n Membri tot:${server.memberCount.toString()}||Bot:${server.members.cache.filter(x => x.user.bot).size.toString()}||Utenti:${server.members.cache.filter(x=> !x.user.bot).size.toString()} \`\`\``, false)
            .addField("Channels", `\`\`\`js\n Canali tot:${server.channels.cache.filter(x=> x.type == "GUILD_VOICE" || x.type == "GUILD_TEXT").size.toString()} || Canali vocali:${server.channels.cache.filter(x=> x.type == "GUILD_VOICE").size.toString()} ||Canali testuali: ${server.channels.cache.filter(x=> x.type == "GUILD_TEXT").size.toString()}  \`\`\``, false)
            .addField("Server created", `\`\`\`js\n ${server.createdAt.toDateString()} \`\`\``, true)
            .addField("Boost level", `\`\`\`js\n Level ${(server.premiumTier != "NONE" ? server.premiumTier : 0) + " (Boost: " + server.premiumSubscriptionCount + ")"} \`\`\``, true)
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}