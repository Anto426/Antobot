module.exports = {
    name: "ping",
    permision: [],
    onlyOwner: false,

    data: {
        name: "ping",
        description: "Ping bot"
    },
    execute(interaction) {
        var embed = new Discord.EmbedBuilder()
            .addFields([
                { name: 'Pong', value: `\`\`\`js\n${client.ws.ping}ms\`\`\`` },
            ])
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })
    }
}