const { EmbedBuilder } = require("discord.js")
const cembed = require("../../settings/embed.json")


async function timeoutembeds(interaction, member, reason) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Utente timeoutato")
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + member + ">" + " timeoutato per " + times(time))
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch { }
}

async function timeoutembede(interaction, member, date) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`${member.toString()} ha già un timeout!`)
            .addFields([
                { name: 'Fino a :', value: `\`\`\`\n ${date} \`\`\`` },
            ])
            .setThumbnail(cembed.image.error)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed] })
    } catch { }
}

async function untimeoutembeds(interaction, member) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Utente untimeoutato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + member + ">" + " untimeoutato")
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch { }
}

async function untimeoutembede(interaction, member) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`${member.toString()} non ha un timeout!`)
            .setThumbnail(cembed.image.error)
            .setColor(cembed.color.rosso)
        interaction.reply({ embeds: [embed] })
    } catch { }
}

module.exports = { timeoutembeds, timeoutembede, untimeoutembeds, untimeoutembede }