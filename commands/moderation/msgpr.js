const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
module.exports = {
    name: "msgpr",
    permisions: [PermissionsBitField.Flags.ManageEvents,PermissionsBitField.Flags.Administrator],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    data: {
        name: "msgpr",
        description: "Invia messagio attraverso il bot ad una persona",
        options: [{
            name: "title",
            description: "titolo",
            type: 3,
            required: true,
        },
        {
            name: "msg",
            description: "messagio",
            type: 3,
            required: true,
        },
        {
            name: "user",
            description: "user",
            type: 6,
            required: true,
        },
        {
            name: "image",
            description: "image",
            type: 3,
            required: false,
        },

        ]
    },
    execute(interaction) {
        let title = interaction.options.getString("title").split("-").join("\n")
        let msg = interaction.options.getString("msg").split("-").join("\n")
        let image = interaction.options.getString("image")

        var embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(msg)
            .setThumbnail(image)
            .setColor(cembed.color.Green)
        user = interaction.options.getMember("user")
        user.send({ embeds: [embed] })

        interaction.reply("Messagio inviato")



    }
}