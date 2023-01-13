const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
module.exports = {
    name: "ban",
    permisions: [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.Administrator],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position:true,
    data: {
        name: "ban",
        description: "banna utente",
        options: [{
            name: "user",
            description: "utente",
            type: 6,
            required: true,
        },
        {
            name: "reason",
            description: "motivo",
            type: 3,
            required: false,
        }
        ]
    },
    execute(interaction) {
        let reason = interaction.options.getString("msg").split("-").join("\n")

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