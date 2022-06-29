module.exports = {
    name: "iclear",
    onlyStaff: false,
    onlyOwner: true,
    data: {
        name: "iclear",
        description: "cancella tutti gli inviti ",
    },
    execute(interaction) {

        interaction.guild.invites.fetch().then(invites => {
            invites.each(i => i.delete())
        })
        const embed = new Discord.MessageEmbed()
            .setTitle("Inviti eliminati")
            .setDescription("Tutti gli inviti sono stati eliminati")
            .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })

    }
}