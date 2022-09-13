function msg(interaction) {
    const embed = new configs.Discord.EmbedBuilder()
        .setTitle("Error")
        .setDescription("Ops! Qualcosa è andato storto!!")
        .setThumbnail(configs.settings.embed.images.error)
        .setColor(configs.settings.embed.color.red)
    interaction.reply({ embeds: [embed] })
}

module.exports ={ 
    message:msg
}