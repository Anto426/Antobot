const { PermissionsBitField } = require('configs.Discord.js');
const configs = require("./../../index")
module.exports = {
    name: "unban",
    permision: [PermissionsBitField.Flags.BanMembers],
    onlyOwner: false,
    onlyStaff : false,
    data: {
        name: "unban",
        description: "Unban utente",
        options: [{
            name: "iduser",
            description: "id dell'utente interessato",
            type: 3,
            required: true
        }]
    },
    execute(interaction) {

        var id = interaction.options.getString("iduser")
        let a = true
        try {
            interaction.guild.bans.fetch().then(banned => {
                banned.forEach(element => {
                    if (element.user.id.toString() == id)
                        a = false
                })
            }).then(x => {

                if (!a) {
                    interaction.guild.members.unban(id)
                    const embed = new configs.Discord.EmbedBuilder()
                        .setTitle("Utente sbannato")
                        .setDescription("Utente sbannato")
                        .setThumbnail(configs.settings.embed.images.succes)
                        .setColor(configs.settings.embed.color.green)
                    interaction.reply({ embeds: [embed] })
                } else {
                    const embed = new configs.Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Utente gia sbannato")
                        .setThumbnail(configs.settings.embed.images.error)
                        .setColor(configs.settings.embed.color.red)
                    interaction.reply({ embeds: [embed] })
                }
            })
            return
        } catch {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle(message.member.user.tag + " Error")
                .setDescription("Ops! Qualcosa è andato storto!!")
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            message.channel.send({ embeds: [embed] })
        }


    }
}