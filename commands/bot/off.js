const configs = require("./../../index")
const errmsg = require("./../../function/msg/errormsg")
module.exports = {
    name: "off",
    permision: [],
    onlyOwner: true,
    onlyStaff: false,
    defaultchannel: true,
    data: {
        name: "off",
        description: "Spegne il bot"
    },
    execute(interaction) {
        if (!configs.stato) {
            errmsg.offonmsg(interaction,false)
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