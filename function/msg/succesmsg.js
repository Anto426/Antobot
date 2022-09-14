const configs = require("../../index")
function kickmsg(interaction, member, reason) {
    let frasi = ["<@" + member + ">" + " kikato", "Oh la prossima volta ripetta le regole " + "<@" + member + ">"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new configs.Discord.EmbedBuilder()
        .setTitle("Utente bannato")
        .setDescription(frasi[x])
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(configs.settings.embed.color.green)
        .addFields([
            { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
        ])
    interaction.reply({ embeds: [embed] })
}

function banmsg(interaction, member, reason) {
    let frasi = ["<@" + member + ">" + " bannato", "Misa che qualcuno non rispetta le regole " + "<@" + member + ">"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new configs.Discord.EmbedBuilder()
        .setTitle("Utente bannato")
        .setDescription(frasi[x])
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(configs.settings.embed.color.green)
        .addFields([
            { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
        ])
    interaction.reply({ embeds: [embed] })

}


function notpermisionmsg(interaction, user, reason) {
    let frasi = ["Non hai il permesso per usare questo commando o non puoi eseguirlo in questa chat"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new configs.Discord.EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x].toString())
        .setThumbnail(configs.settings.embed.images.error)
        .setColor(configs.settings.embed.color.red)
    interaction.reply({ embeds: [embed] })

}


module.exports = {
    genericmsg: genericmsg,
    tohigtmsg: tohigtmsg,
    notpermisionmsg: notpermisionmsg,
    offonmsg: offonmsg
}