module.exports = {
    name: "iclear",
    opermision: [],
    onlyOwner: true,
    data: {
        name: "iclear",
        description: "Elimina tutti gli inviti del server",
    },
    execute(interaction) {

        interaction.guild.invites.fetch().then(invites => {
            invites.each(i => i.delete())
        })
        const embed = new Discord.EmbedBuilder()
            .setTitle("Inviti eliminati")
            .setDescription("Tutti gli inviti sono stati eliminati")
            .setThumbnail(configs.embed.images.succes)
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })

    }
}