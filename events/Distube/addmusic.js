const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../setting/embed.json")
module.exports = {
    name: "addSong",
    async execute(queue, song) {
        let embed = new EmbedBuilder()
            .setTitle("Canzone aggiunta alla coda")
            .setThumbnail(cembed.immage.load)
            .addFields([{ name: "Canzone", value: `\`\`\`\n ${song.name}  \`\`\`` }])
            .setColor(cembed.color.Green)
        queue.textChannel.send({ embeds: [embed] })
    }
}