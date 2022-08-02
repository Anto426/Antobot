module.exports = {
    name: "tiket",
    permision: [],
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
                .setStyle('DANGER')
                .setLabel('Apri il ticket'),
            );
        let embed = new Discord.EmbedBuilder()
            .setTitle("Hey")
            .setDescription("Hai bisogno di supporto crea un ticket")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor(configs.embed.color.red)
        interaction.channel.send({ embeds: [embed], components: [row] })

    }
}