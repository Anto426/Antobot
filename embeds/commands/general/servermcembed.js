const { EmbedBuilder } = require("discord.js")
const cembed = require("../../../settings/embed.json")
const cgame = require("../../../settings/games.json")
const { genericerr } = require("../../err/generic");

async function servermcembedint(interaction, row) {
    try {
        let embed = new EmbedBuilder()
            .setTitle(cgame.mc.server[interaction.values[0]].emoji + " " + interaction.values[0])
            .setDescription(`Ecco il tuo server spero ti sia stato di aiuto`)
            .addFields({ name: `ip:`, value: `\`\`\`\n${cgame.mc.server[interaction.values[0]].ip.toString()}\n\`\`\`` })
            .setThumbnail(cgame.mc.server[interaction.values[0]].image)
            .setColor(cgame.mc.server[interaction.values[0]].color)
        interaction.update({ embeds: [embed], components: [row] })
    } catch (err) {
        console.log(err)
        genericerr(interaction, err)
    }
}


async function servermcembeddef(interaction, row, server) {
    try {

        let embed = new EmbedBuilder()
            .setTitle("Server MC")
            .setDescription(`
            Usa il menu qui sotto per ottenere ip dei server di minecraft
        
            ${server.join("\n \n")}`)
            .setThumbnail(cgame.mc.image)
            .setColor(cembed.color.viola)
        interaction.reply({ embeds: [embed], components: [row] })
    } catch (err) {
        console.log(err)
        genericerr(interaction, err)
    }
}

module.exports = { servermcembedint, servermcembeddef }