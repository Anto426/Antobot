const cembed = require("./../../setting/embed.json")
const { EmbedBuilder } = require("discord.js")


async function sendto(user, content, channel) {

    try {
        user.send(content).catch((err) => {
            const embed = new EmbedBuilder()
                .setTitle("Error")
                .setColor(cembed.color.Red)
                .setDescription(user.toString() + " ha i dm chiusi non posso contattarlo in privato")
            channel.send({ embeds: [embed] })
        })
    } catch (err) { }
}
module.exports = { sendto }

