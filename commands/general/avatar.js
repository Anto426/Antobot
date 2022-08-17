const configs = require("./../../index")
module.exports = {
    name: "avatar",
    permision: [],
    onlyOwner: false,
    onlyStaff : false,
    data: {
        name: "avatar",
        description: "avatar di un utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: false
        }]
    },
    execute(interaction) {

        var member = interaction.options.getMember("user")
        if (!member) {
            utente = interaction.member
        }
        var embed = new Discord.EmbedBuilder()
            .setTitle(utente.user.tag)
            .setDescription("L'avatar di questo utente")
            .setColor(configs.config.embed.color.green)
            .setImage(utente.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
        interaction.reply({ embeds: [embed] })
    }
}