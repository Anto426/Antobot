module.exports = {
    name: "avatar",
    permision: [],
    onlyOwner: false,
    data: {
        name: "avatar",
        description: "avatar di un utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: false
        }]
    },
    execute(interaction) {

        var member = interaction.options.getUser("user")
        if (!member) {
            utente = interaction.member
        } else {
            var utente = interaction.guild.members.cache.get(member.id)

        }
        var embed = new Discord.EmbedBuilder()
            .setTitle(utente.user.tag)
            .setDescription("L'avatar di questo utente")
            .setColor(configs.embed.color.green)
            .setImage(utente.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
        interaction.reply({ embeds: [embed] })
    }
}