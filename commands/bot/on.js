const configs = require("./../../index")
const errmsg = require("./../../function/msg/errormsg")
module.exports = {
    name: "on",
    permision: [],
    onlyOwner: true,
    onlyStaff: false,
    defaultchannel: true,
    data: {
        name: "on",
        description: "Accende il bot"
    },
    execute(interaction) {
        if (configs.stato) {
            errmsg.offonmsg(interaction,true)
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