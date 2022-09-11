const { PermissionsBitField } = require('discord.js');
const configs = require("./../../index")
module.exports = {
    name: 'report',
    description: 'Report bug',
    permision: [],
    onlyOwner: false,
    onlyStaff: false,
    data: {
        name: "bug",
        description: "send report bug ",
        option: [{
            name: 'bug',
            description: 'Bug da reportare',
            type: 3,
            required: true
        }],
    },

    async execute(interaction) {

        let description = interaction.option.getString("bug")

        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Bug reportato con successo")
            .setDescription(description)
            .setThumbnail(configs.settings.embed.images.forte)
            .setColor(configs.settings.embed.color.red)


        const embed1 = new configs.Discord.EmbedBuilder()
            .setTitle("B")
            .setDescription(description)
            .setThumbnail(configs.settings.embed.images.forte)
            .setColor(configs.settings.embed.color.red)



        interaction.guild.channel.find(x => x.id == configs.settings.antoslog.stanze.bugrepo).send({ embeds: [embed] })

        interaction.reply({ embeds: [embed1] })

    }
}