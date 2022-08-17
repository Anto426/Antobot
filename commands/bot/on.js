const configs = require("./../../index")
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
        if (configs.stato) {
            const embederror = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Il bot è gia online")
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            interaction.reply({ embeds: [embederror] })
            return
        } else {
            const embedonline = new configs.Discord.EmbedBuilder()
                .setTitle("Bot online")
                .setDescription("Il bot sta riabilitando tutti i sistemi come richiesto")
                .setThumbnail(configs.settings.embed.images.succes)
                .setColor(configs.settings.embed.color.green)
            configs.client.user.setStatus("online");

            configs.stato = true;
            interaction.reply({ embeds: [embedonline] })
        }

    }
}