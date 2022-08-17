const configs = require("./../../index")
module.exports = {
    name: "off",
    permision: [],
    onlyOwner: true,

    data: {
        name: "off",
        description: "Spegne il bot"
    },
    execute(interaction) {
        if (!configs.stato) {
            const embederror = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Il bot è gia offline")
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.config.embed.color.red)
            interaction.reply({ embeds: [embederror] })
            return
        } else {
            const embedonline = new configs.settings.Discord.EmbedBuilder()
                .setTitle("Bot offline")
                .setDescription("Il bot sta andando offline come da te richiesto")
                .setThumbnail(configs.settings.embed.images.succes)
                .setColor(configs.settings.embed.color.green)
            configs.client.user.setStatus("invisible");

            configs.stato = false;
            interaction.reply({ embeds: [embedonline] })
        }

    }
}