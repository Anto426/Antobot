const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../setting/embed.json")
module.exports = {
    name: "searchNoResult",
    async execute(interaction, query) {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setThumbnail(song.thumbnail)
            .setDescription("Canzone non trovata riprova!")
            .setColor(cembed.color.Green)
        interactions.reply({ embeds: [embed] })
    }
}