const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../setting/embed.json")
const emoji = require("./../../setting/emoji.json")
const cguild = require("./../../setting/guild.json")
module.exports = {
    name: "ping",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: false,
    test: false,
    data: {
        name: "ping",
        description: "Ping bot"
    },
    execute(interaction) {
        let embed = new EmbedBuilder()
            .addFields([
                { name: `${emoji.pong} Pong`, value: `\`\`\`\n${client.ws.ping}ms\`\`\`` },
                { name: `${emoji.ram} Ram`, value: `\`\`\`\n${(process.memoryUsage().heapUsed / 1048576).toFixed(0)}mb\`\`\`` },
                { name: `${emoji.time} Time`, value: `\`\`\`\n${timeonc}\`\`\`` },

            ])
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color.Green)
        interaction.reply({ embeds: [embed] })
    }
}