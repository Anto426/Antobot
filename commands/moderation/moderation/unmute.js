const { PermissionsBitField } = require('discord.js');
const configs = require("./../../index")
module.exports = {
    name: "unmute",
    permision: [PermissionsBitField.Flags.MuteMembers],
    onlyOwner: false,
    onlyStaff : false,
    data: {
        name: "unmute",
        description: "Smuta utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        }]
    },
    async execute(interaction) {
        var utente = interaction.options.getMember("user")

        if (utente.user.bot) {
            const embed = new Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`Non posso mutare/smutare i bot `)
                .setThumbnail(configs.config.embed.images.error)
                .setColor(configs.config.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }

        let muted = interaction.guild.roles.cache.find(x => x.name == "MutedA")


        if (!utente.roles.cache.has(muted.id)) {
            const embed = new Discord.EmbedBuilder()
                .setTitle(interaction.member.user.tag + " Error")
                .setDescription(utente.user.tag + " risulta già smutato")
                .setThumbnail(configs.config.embed.images.error)
                .setColor(configs.config.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        }
        for (id in configs.config.owner) {
            if (interaction.member == utente && interaction.member.id != configs.config.owner[id]) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle("Error")
                    .setDescription(`Ehh bro non puoi togliertelo tu ahh`)
                    .setThumbnail(configs.config.embed.images.scemo)
                    .setColor(configs.config.embed.color.red)
                return interaction.reply({ embeds: [embed] })

            }
        }
        const embed = new Discord.EmbedBuilder()
            .setTitle("Utente smutato")
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + utente + ">" + " smutato")
            .setColor(configs.config.embed.color.green)
        interaction.reply({ embeds: [embed] })
        utente.roles.remove(muted).catch(() => {})

    }
}