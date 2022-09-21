const { PermissionsBitField } = require('discord.js')
const configs = require("./../../index")
module.exports = {
    name: "archivia",
    permision: [PermissionsBitField.Flags.Administrator],
    onlyOwner: true,
    onlyStaff: false,
    data: {
        name: "archivia",
        description: "Archivia il server rimuovendo tutti i membri",
    },
    execute(interaction) {

        interaction.reply("Avvio potrocollo di autodistruzione")
        let embed = new configs.Discord.EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setDescription("@everyone " + interaction.guild.name + " ha chiuso i battenti")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.red)
        let channel = interaction.guild.channels.cache.get(configs.settings[interaction.guild.name].stanze.annunci)
        console.log(channel)
        channel.send({ embeds: [embed] })
        setTimeout(() => {
            interaction.guild.members.cache.forEach(element => {
                if (element.user.bot) return
                element.send({ embeds: [embed] }).catch(() => { })
                element.kick().catch(() => { })


            });
            interaction.guild.invites.fetch().then(invites => {
                invites.each(i => i.delete())
            })

        }, 1000 * 300)
    }
}