const { EmbedBuilder } = require("discord.js")
const cembed = require("../../settings/embed.json")

async function kickembeds(interaction, member, reason) {
    try {
        let embed = new EmbedBuilder()
            .setTitle("Utente kikato")
            .setDescription("<@" + member + ">" + " kikato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color.verde)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
    } catch { }
}

module.exports = { kickembeds }