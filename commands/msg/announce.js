const { PermissionsBitField } = require('discord.js')
const configs = require("./../../index")
module.exports = {
    name: "announce",
    permision: [PermissionsBitField.Flags.ModerateMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,
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

        var embed = new configs.Discord.EmbedBuilder()
            .setTitle(title)
            .setDescription(msg)
            .setThumbnail(image)
            .setColor(configs.settings.embed.color.green)
        channel = interaction.options.getChannel("channel") || interaction.guild.channels.cache.find(x => x.id == configs[interaction.guild.name].stanze.eventi)
        channel.send({ embeds: [embed] })

        interaction.reply("Messagio inviato")



    }
}