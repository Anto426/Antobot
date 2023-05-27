const { EmbedBuilder } = require('discord.js');
const cgame = require("./../../settings/games.json")
const cembed = require("./../../settings/embed.json");
const { createrowmc } = require('../../functions/row/createrow');
module.exports = {
    name: "servermc",
    permisions: [],
    allowedchannels: [],
    position: false,
    test: false,
    data: {
        name: "servermc",
        description: "comando per ottenere ip di minecraft"
    },
    execute(interaction) {
        let server = []
        let row = createrowmc(interaction, server)
        let embed = new EmbedBuilder()
            .setTitle("Server MC")
            .setDescription(`
            Usa il menu qui sotto per ottenere ip dei server di minecraft

            ${server.join("\n \n")}`)
            .setThumbnail(cgame.mc.image)
            .setColor(cembed.color.viola)
        interaction.reply({ embeds: [embed], components: [row] })
    }
}