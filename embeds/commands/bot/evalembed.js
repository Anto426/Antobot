const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../../settings/embed.json")
const { genericerr } = require("../../err/generic");
const { inspect } = require(`util`)
async function evalsembed(interaction) {
    try {
        const embed = new EmbedBuilder()
            .setTitle("Comando eseguito con successo")
            .setColor(cembed.color.verde)
            .setDescription(`Non ci sono stati errori durante l 'esecuzione del comando
        output :\`\`\`\n ${inspect((evaled))}  \`\`\``)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }) || cembed.image.notimmage)
        interaction.reply({ embeds: [embed] })
    } catch (err) { genericerr(interaction, err) }
}
async function evalfembed(interaction, args, error) {
    try {
        let embed = new EmbedBuilder()
            .addFields([
                { name: `:computer: INPUT:`, value: `\`\`\`\n${args}\`\`\`` },
                { name: ':warning: Error:', value: `\`\`\`\n${inspect((error.toString()))}  \`\`\`` },

            ])
            .setTitle("Errore")
            .setThumbnail(cembed.image.error)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (err) { genericerr(interaction, err) }
}


module.exports = {
    evalsembed, evalfembed
}