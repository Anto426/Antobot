module.exports = {
    name: "off",
    onlyStaff: false,
    onlyOwner: true,
    data: {
        name: "off",
        description: "Spegne il bot"
    },
    execute(interaction) {
        if (!stato) {
            const embederror = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Il bot è gia offline")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embederror] })
            return
        } else {
            const embedonline = new Discord.EmbedBuilder()
                .setTitle("Bot offline")
                .setDescription("Il bot sta andando offline come da te richiesto")
                .setThumbnail(configs.embed.images.succes)
                .setColor(configs.embed.color.green)
            client.user.setStatus("invisible");

            stato = false;
            interaction.reply({ embeds: [embedonline] })
        }

    }
}