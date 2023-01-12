const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../setting/embed.json")
const { times0 } = require("./../../functions/time/timef")
module.exports = {
    name: "playSong",
    async execute(queue, song) {
        let embed = new EmbedBuilder()
            .setTitle("Canzone in riproduzione")
            .addFields(
                [
                    { name: "Canzone", value: `\`\`\`\n ${song.name}  \`\`\`` },
                    { name: "Durata", value: `\`\`\`\n ${times0(song.duration)}  \`\`\`` },
                    { name: "Richiesta da", value: song.user.toString() },
                ])
            .setThumbnail(song.thumbnail)
            .setColor(cembed.color.Green)
        queue.textChannel.send({ embeds: [embed] })
    }
}