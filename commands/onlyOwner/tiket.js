module.exports = {
    name: "tiket",
    onlyStaff: false,
    onlyOwner: true,
    data: {
        name: "tiket",
        description: "create tiket"
    },
    async execute(interaction) {
        let row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId('opentiket')
                .setStyle('DANGER')
                .setLabel('Apri il ticket'),
            );
        let embed = new Discord.MessageEmbed()
            .setTitle("Hey")
            .setDescription("Hai bisogno di supporto crea un ticket")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor(configs.embed.color.red)
        interaction.channel.send({ embeds: [embed], components: [row] })

    }
}