const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../settings/embed.json")
const { sendtoalllog } = require("../../functions/log/sendtolog")
async function logleftmember(member) {

    try {
        const embed = new EmbedBuilder()
            .setTitle("Utente Uscito")
            .addFields(
                { name: ":bust_in_silhouette: name", value: member.user.tag },
                { name: ":id: id", value: member.user.id },
                { name: ":timer: ora ", value: `${new Date().toLocaleTimeString()}\n${new Date().toLocaleDateString()}` },
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor(cembed.color.rosso)
        sendtoalllog({ embeds: [embed], })

    } catch { }
}
module.exports = {
    logleftmember
}