const configs = require("./../../index")
module.exports = {
    name: "serverinfo",
    permision: [],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel : false,
    data: {
        name: "serverinfo",
        description: "Informazioni sul server"
    },
    async execute(interaction) {
        var server = interaction.member.guild;
        let countingonline = await server.members.cache.filter(x => x.presence?.status == 'online').size
        let countingidle = await server.members.cache.filter(x => x.presence?.status == 'idle').size

        const embed = new configs.Discord.EmbedBuilder()
            .setTitle(server.name)
            .setColor(configs.settings.embed.color.green)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL({ dynamic: true }) || configs.settings.embed.images.noimmage)
            .addFields([
                { name: 'Owner', value: `\`\`\`\n${server.members.cache.get(server.ownerId).nickname}\`\`\`` },
                { name: `Livello di verifica:`, value: `\`\`\`\nAlto\`\`\`` },
                { name: `Server id:`, value: `\`\`\`\n${server.id}\`\`\`` },
                {
                    name: `Members:`, value: ` \`\`\`\n  
Membri tot: ${server.memberCount.toString()}
                  
Bot:${server.members.cache.filter(x => x.user.bot).size.toString()}
                  
Utenti:${server.members.cache.filter(x => !x.user.bot).size.toString()}
                  
online: ${countingonline + countingidle}
                  
                  
                  \`\`\`` },
                {
                    name: `Channels:`, value: `\`\`\`\n

Canali tot:${server.channels.cache.filter(x => x.type == "GUILD_VOICE" || x.type == "GUILD_TEXT").size.toString()}
                  
Canali vocali:${server.channels.cache.filter(x => x.type == "GUILD_VOICE").size.toString()} || Canali testuali: ${server.channels.cache.filter(x => x.type == "GUILD_TEXT").size.toString()}
                  
                  \`\`\`` },
                { name: `Server created:`, value: `\`\`\`\n${server.id}\`\`\`` },
                { name: `Boost level Level:`, value: `\`\`\`\n${server.id}\`\`\`` }
            ])
        interaction.reply({ embeds: [embed] })
    }
}