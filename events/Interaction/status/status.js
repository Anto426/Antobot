const { EmbedBuilder } = require("discord.js")
const cembed = require("../../../setting/embed.json")
module.exports = {
    name: "interactionCreate-statusoff",
    async execute(interaction) {

        let embed = new EmbedBuilder()
            .setTitle("Bot non pronto")
            .setDescription("Il bot non è ancora pronto")
            .setThumbnail(cembed.immage.err)
            .setColor(cembed.color.Yellow)

        if (!bootstate)
            interaction.reply({ embeds: [embed], ephemeral: true })


    }
}
