const { ButtonStyle, PermissionsBitField } = require('discord.js');
const configs = require("./../../index")
module.exports = {
    name: "tiket",
    permision: [PermissionsBitField.Flags.Administrator],
    onlyOwner: true,
    onlyStaff: false,
    defaultchannel: true,
    data: {
        name: "tiket",
        description: "Crea il canale tiket"
    },
    async execute(interaction) {
        let row = new configs.Discord.ActionRowBuilder()
            .addComponents(
                new configs.Discord.ButtonBuilder()
                    .setCustomId('opentiket')
                    .setStyle(ButtonStyle.Danger)
                    .setLabel('Apri il ticket'),
            );
        let embed = new configs.Discord.EmbedBuilder()
            .setTitle("Hey")
            .setDescription("Hai bisogno di supporto crea un ticket")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.red)
        interaction.channel.send({ embeds: [embed], components: [row] })

    }
}