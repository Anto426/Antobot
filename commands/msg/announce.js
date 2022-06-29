module.exports = {
    name: "announce",
    onlyStaff: true,
    onlyOwner: false,
    data: {
        name: "announce",
        description: "create changlog",
        options: [{
                name: "title",
                description: "titolo",
                type: "STRING",
                required: true,
            },
            {
                name: "msg",
                description: "messagio",
                type: "STRING",
                required: true,
            },
            {
                name: "channel",
                description: "channel",
                type: "CHANNEL",
                required: false,
            },
            {
                name: "image",
                description: "image",
                type: "STRING",
                required: false,
            },

        ]
    },
    execute(interaction) {
        let title = interaction.options.getString("title").split("-").join("\n")
        let msg = interaction.options.getString("msg").split("-").join("\n")
        let image = interaction.options.getString("image")

        var embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(msg)
            .setThumbnail(image)
            .setColor(configs.embed.color.green)
        channel = interaction.options.getChannel("channel") || interaction.guild.channels.cache.find(x => x.id == configs[interaction.guild.name].stanze.eventi)
        channel.send({ embeds: [embed] })

        interaction.reply("Messagio inviato")



    }
}