const { PermissionsBitField } = require('discord.js');
const configs = require("./../../../index")
module.exports = {
    name: "mute",
    permision: [PermissionsBitField.Flags.MuteMembers],
    onlyOwner: false,
    onlyStaff: false,
    defaultchannel : false,
    data: {
        name: "mute",
        description: "Muta utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "motivo",
            type: 3,
            required: false
        }
        ]
    },
    async execute(interaction) {
        var utente = interaction.options.getMember("user")
        var reason = interaction.options.getString("reason") || "Nesun motivo"

        if (utente.user.bot) {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(`Non posso mutare/smutare i bot `)
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            return interaction.reply({ embeds: [embed] })

        }

        let muted = interaction.guild.roles.cache.find(x => x.name == "MutedA")
        if (!muted) {
            muted = await interaction.guild.roles.create({
                name: "MutedA",
                permissions: [""]
            })
            interaction.guild.channels.cache.forEach(channel => {
                channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false })
            });
        }


        if (!utente.kickable) {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Non ho il permesso di mutarlo è troppo forte")
                .setThumbnail(configs.settings.embed.images.forte)
                .setColor(configs.settings.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        }
        if (utente.roles.cache.has(muted.id)) {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription(utente.user.tag + " risulta già mutato")
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        }
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Utente mutato")
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + utente + ">" + " mutato")
            .setColor(configs.settings.embed.color.green)
        utente.roles.add(muted).catch(() => {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Qualcosa è andato storto!")
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            interaction.reply({ embeds: [embed] })
            return
        })
        interaction.reply({ embeds: [embed] })
        const embed1 = new configs.Discord.EmbedBuilder()
            .setTitle("Utente mutato")
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
            .setDescription("<@" + utente + "> sei stato mutato ")
            .setColor(configs.settings.embed.color.green)
        utente.send({ embeds: [embed1] }).catch(() => {
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setDescription("Qualcosa è andato storto non ho potuto avvisare " + " ")
                .setThumbnail(configs.settings.embed.images.error)
                .setColor(configs.settings.embed.color.red)
            interaction.channel.send({ embeds: [embed] })
        })








    }
}