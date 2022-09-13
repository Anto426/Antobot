

function msg(interaction) {
    let frasi = ["Ops! Qualcosa è andato storto!!", "Riprova sarai più fortunato , Ho riscrontrato alcuni errori durante l'esecuzione del comando"]
    var x = Math.floor(Math.random() * frasi.length);
    const embed = new configs.Discord.EmbedBuilder()
        .setTitle("Error")
        .setDescription(frasi[x].toString())
        .setThumbnail(configs.settings.embed.images.error)
        .setColor(configs.settings.embed.color.red)
    interaction.reply({ embeds: [embed] })
}

module.exports ={ 
    message:msg
}