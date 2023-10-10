const { EmbedBuilder } = require("discord.js")
const cembed = require("../../../settings/embed.json")
const cgame = require("../../../settings/games.json")
const { genericerr } = require("../../err/generic");
const { replyin } = require("../../../functions/replyin/replyin");

async function exoisembedint(interaction, row, name, score,livel, author) {
    try {
        let embed = new EmbedBuilder()
            .setTitle(name)
            .setDescription(`Clicca su questo pulsante per scaricare l'esercizo`)
            .addFields({ name: `livel:`, value: `${livel} ` })
            .addFields({ name: `score:`, value: `\`\`\`\n${score}\n\`\`\`` })
            .addFields({ name: `Author:`, value: `\`\`\`\n${author}\n\`\`\`` })
        interaction.update({ embeds: [embed], components: [row] })
    } catch (err) {
        console.log(err)
        genericerr(interaction, err)
    }
}


async function exoisembedf(interaction, row, ex) {
    try {

        console.log(ex)
        let embed = new EmbedBuilder()
            .setTitle("Esercizi OIS")
            .setDescription(
                `
Usa il menu qui sotto per ottenere uno dei tanti eserci svolti \`\`\`diff\nNote:Il seguente comando potra essere usato solo dai BitMasters\`\`\`

${ex.join("\n \n")} `

            )
            .setThumbnail(cembed.image.ois)
            .setColor(cembed.color.viola)

        replyin(interaction, { embeds: [embed], components: [row] })
    } catch (err) {
        console.log(err)
        genericerr(interaction, err)
    }
}

module.exports = { exoisembedint, exoisembedf }