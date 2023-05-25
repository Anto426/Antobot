const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../../settings/embed.json")
const { genericerr } = require("../../err/error")
async function pingembed(interaction) {
    try {
        let embed = new EmbedBuilder()
            .addFields([
                { name: `:lacrosse: Pong`, value: `\`\`\`\n${client.ws.ping}ms\`\`\`` },
                { name: `:computer: Ram`, value: `\`\`\`\n${(process.memoryUsage().heapUsed / 1048576).toFixed(0)}mb\`\`\`` },
                { name: `:timer: Time`, value: `\`\`\`\n${global.timeonc}\`\`\`` },

            ])
            .setTitle("Pong ecco il ping del bot")
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch (err) { genericerr(interaction, err) }
}



module.exports = { pingembed }