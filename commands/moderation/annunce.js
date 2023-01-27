const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
module.exports = {
    name: "announce",
    permisions: [PermissionsBitField.Flags.ManageEvents, PermissionsBitField.Flags.Administrator],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: false,
    test: false,

    data: {
        name: "announce",
        description: "Invia messagio attraverso il bot",
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
            name: "channel",
            description: "channel",
            type: 7,
            required: false,
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
        channel = interaction.options.getChannel("channel") || interaction.guild.channels.cache.find(x => x.id == cguild['Anto\'s  Server'].channel.serverinfo.annunce)
        channel.send({ embeds: [embed] })

        interaction.reply("Messagio inviato")



    }
}