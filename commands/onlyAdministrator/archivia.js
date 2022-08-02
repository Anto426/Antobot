const { PermissionsBitField } = require('discord.js')
module.exports = {
    name: "archivia",
    permision: [PermissionsBitField.Flags.Administrator],
    onlyOwner: true,
    onlyStaff : false,
    data: {
        name: "archivia",
        description: "Archivia il server rimuovendo tutti i membri",
    },
    execute(interaction) {

        interaction.reply("Avvio potrocollo di autodistruzione")
        let embed = new Discord.EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setDescription("@everyone " + interaction.guild.name + " ha chiuso i battenti")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor(configs.embed.color.red)
        console.log(configs[interaction.guild.name].stanze.eventi)
        let channel = interaction.guild.channels.cache.find(x => x.id == configs[interaction.guild.name].stanze.eventi)
        console.log(channel)
        channel.send({ embeds: [embed] })
        setTimeout(() => {
            interaction.guild.members.cache.forEach(element => {
                if (element.user.bot) return
                element.send({ embeds: [embed] }).catch(() => {})
                element.kick().catch(() => {})


            });
            interaction.guild.invites.fetch().then(invites => {
                invites.each(i => i.delete())
            })

        }, 1000 * 300)
    }
}