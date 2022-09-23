const configs = require("./../../index")
module.exports = {
    name: "ping",
    permision: [],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel : false,
    data: {
        name: "ping",
        description: "Ping bot"
    },
    execute(interaction) {
        var embed = new configs.Discord.EmbedBuilder()
            .addFields([
                { name: 'Pong', value: `\`\`\`\n${configs.client.ws.ping}ms\`\`\`` },
            ])
            .setThumbnail(configs.client.user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
        interaction.reply({ embeds: [embed] })
    }
}