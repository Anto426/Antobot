const { EmbedBuilder } = require('discord.js');
const cembed = require("./../../setting/embed.json")
module.exports = {
    name: "avatar",
    permisions: [],
    allowedchannels: global.AllowCommands,
    position: false,
    test: false,
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
        var embed = new EmbedBuilder()
            .setTitle(utente.user.tag)
            .setDescription("L'avatar di questo utente")
            .setColor(cembed.color.Green)
            .setImage(utente.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
        interaction.reply({ embeds: [embed] })
    }
}