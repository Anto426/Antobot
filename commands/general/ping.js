const {configs} = require("./../../index")
module.exports = {
    name: "ping",
    permision: [],
    onlyOwner: false,
    defaultchannel: true,
    data: {
        name: "ping",
        description: "Ping bot"
    },
    execute(interaction) {
        var embed = new configs.Discord.EmbedBuilder()
            .addFields([
                { name: 'Pong', value: `\`\`\`\n${configs.client.ws.ping}ms\`\`\`` },
            ])
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.emded.color.Green)
        interaction.reply({ embeds: [embed] })
    }
}