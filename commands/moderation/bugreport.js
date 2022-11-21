const { PermissionsBitField } = require('discord.js');
const configs = require("./../../index")
module.exports = {
    name: 'report',
    description: 'Report bug',
    permision: [],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel: true,
    data: {
        name: "report",
        description: "send report bug ",
        options: [
            {
                name: "bug",
                description: "Bug to report",
                type: 3,
                required: true,
            }
        ]
    },
    async execute(interaction) {

        let description = interaction.options.getString("bug")

        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Bug reportato con successo")
            .setDescription(`\`\`\`\n${description}\`\`\``)
            .setThumbnail(configs.settings.embed.images.Bug)
            .setColor(configs.settings.embed.color.red)


        const embed1 = new configs.Discord.EmbedBuilder()
            .setTitle("BUG")
            .setDescription(`\`\`\`\n${description}\`\`\``)
            .setThumbnail(configs.settings.embed.images.Bug)
            .setColor(configs.settings.embed.color.red)



        let channel = configs.guildrepo.bug

        channel.send({ embeds: [embed1] })

        interaction.reply({ embeds: [embed] })

    }
}