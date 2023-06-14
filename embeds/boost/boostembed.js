const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../settings/embed.json")
const cguild = require("./../../settings/guild.json")
const { genericerr } = require("../../err/generic");

async function boostembed( newmeber) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Bost")
            .setDescription(newmeber + `grazie di aver boostato il server`)
            .setThumbnail(cembed.image.boost)
            .setColor(cembed.color.viola)
            newmeber.guild.channels.cache.find(x => x.id == cguild["Anto's  Server"].channel.info.boost).se({ embeds: [embed]})
    } catch (err) { genericerr(newmeber, err) }
}


module.exports = {
    boostembed
}