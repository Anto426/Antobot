module.exports = {
    name: "on",
    permision: [],
    onlyOwner: true,
    onlyStaff : false,
    data: {
        name: "on",
        description: "Accende il bot"
    },
    execute(interaction) {
        if (stato) {
            const embederror = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Il bot è gia online")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embederror] })
            return
        } else {
            const embedonline = new Discord.EmbedBuilder()
                .setTitle("Bot online")
                .setDescription("Il bot sta riabilitando tutti i sistemi come richiesto")
                .setThumbnail(configs.embed.images.succes)
                .setColor(configs.embed.color.green)
            client.user.setStatus("online");

            stato = true;
            interaction.reply({ embeds: [embedonline] })
        }

    }
}