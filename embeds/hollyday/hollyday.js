const cguild = require("./../../settings/guild.json")
async function congratulatioembed(festa) {

    try {
        const embed = new Discord.EmbedBuilder()
            .setTitle(festa.name)
            .setDescription(`
'@everyone'
${festa.descrizione}
`)
            .setThumbnail(festa.image)
            .setColor(festa.color)
        guild.channels.cache.get(cguild["Anto's  Server"].channel.serverinfo.annunce).send({ embeds: [embed] })
    } catch { }
}

module.exports = {
    congratulatioembed
}