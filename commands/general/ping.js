module.exports = {
    name: "ping",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "ping",
        description: "ping bot"
    },
    execute(interaction) {
        var embed = new Discord.MessageEmbed()
            .addField("Pong", `\`\`\`js\n ${client.ws.ping}ms \`\`\``)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })
    }
}