const { EmbedBuilder, } = require("discord.js")
const cembed = require("../../../settings/embed.json")
const { genericerr } = require("../../err/generic");


async function pingembed(interaction) {
    try {
        let embed = new EmbedBuilder()
            .addFields([
                { name: `:lacrosse: PONG`, value: `\`\`\`\n${client.ws.ping}ms\`\`\`` },
                { name: `:computer: RAM USATA`, value: `\`\`\`\n${(process.memoryUsage().heapUsed / 1048576).toFixed(0)}mb\`\`\`` },
                { name: `:timer: TEMPO ACCESO`, value: `\`\`\`\n${global.timeonc}\`\`\`` },

            ])
            .setTitle("Pong ecco il ping del bot")
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }) || cembed.image.notimmage)
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch (err) { genericerr(interaction, err) }
}



module.exports = { pingembed }