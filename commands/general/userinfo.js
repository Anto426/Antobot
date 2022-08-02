const { PermissionsBitField } = require('discord.js');
module.exports = {
    name: "userinfo",
    permision: [],
    onlyOwner: false,

    data: {
        name: "userinfo",
        description: "Informazioni di un utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: false
        }]
    },
    execute(interaction) {

        var member = interaction.options.getMember("user")
        if (!member) {
            member = interaction.member
        }

        var elencoPermessi = [];
        if (member.id == interaction.guild.ownerId) {
            elencoPermessi.push("👑 Owner");
        } else {
            if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                elencoPermessi.push("👑 ADMINISTRATOR");
            } else {
                elencoPermessi = member.permissions.toArray()
            }
        }
        var embed = new Discord.EmbedBuilder()
            .setTitle(member.user.tag)
            .setDescription("Tutte le info di questo utente")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields([
                { name: 'User id', value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: 'Status', value: `\`\`\`\n${member.presence ? member.presence.status : "offline"}\`\`\`` },
                { name: 'Is a bot?', value: `\`\`\`\n${member.user.bot ? "Yes" : "No"}\`\`\`` },
                { name: 'Account created', value: `\`\`\`\n${member.user.createdAt.toDateString()} \`\`\`` },
                { name: 'Joined this server', value: `\`\`\`\n${member.joinedAt.toDateString()}\`\`\`` },
                { name: 'Permissions', value: `\`\`\`\n${elencoPermessi.join("\n")}\`\`\`` },
                { name: 'Roles', value: `\`\`\`\n${member.roles.cache.map(ruolo => ruolo.name).join("\r")}\`\`\`` },


            ])
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })

    }
}