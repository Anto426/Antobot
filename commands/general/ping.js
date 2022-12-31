module.exports = {
    name: "ping",
    permision: [],
    onlyOwner: false,
    defaultchannel: true,
    allowedchannels:[],
    data: {
        name: "ping",
        description: "Ping bot"
    },
    execute(interaction) {
        var embed = new Discord.EmbedBuilder()
            .addFields([
                { name: 'Pong', value: `\`\`\`\n${client.ws.ping}ms\`\`\`` },
            ])
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.emded.color.Green)
        interaction.reply({ embeds: [embed] })
    }
}