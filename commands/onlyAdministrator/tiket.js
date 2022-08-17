const { ButtonStyle ,PermissionsBitField} = require('discord.js');
const configs = require("./../../index")
module.exports = {
    name: "tiket",
    permision: [PermissionsBitField.Flags.Administrator],
    onlyOwner: true,
    onlyStaff : false,
    data: {
        name: "tiket",
        description: "Crea il canale tiket"
    },
    async execute(interaction) {
        let row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('opentiket')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Apri il ticket'),
            );
        let embed = new Discord.EmbedBuilder()
            .setTitle("Hey")
            .setDescription("Hai bisogno di supporto crea un ticket")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor(configs.config.embed.color.red)
        interaction.channel.send({ embeds: [embed], components: [row] })

    }
}