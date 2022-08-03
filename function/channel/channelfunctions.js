function verificchannel(idorname, interaction) {
    let channel = interaction.guild.channels.find(x => x.id || x.name)
    if (!channel) {
        let embed = new Discord.EmbedBuilder()
            .setTitle("Erroor")
            .setImage(configs.embed.image.error)
            .setColor(configs.embed.color.red)
            .setDescription("Error non ho trovaato il canale")
        return false
    }
    return true
}