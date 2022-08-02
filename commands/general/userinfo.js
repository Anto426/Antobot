module.exports = {
    name: "userinfo",
    onlyStaff: false,
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

        var member = interaction.options.getUser("user")
        if (!member) {
            utente = interaction.member
        } else {
            var utente = interaction.guild.members.cache.get(member.id)

        }

        var elencoPermessi = "";
        if (utente.permissions.has("ADMINISTRATOR")) {
            elencoPermessi = "👑 ADMINISTRATOR";
        } else {
            var permessi = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS_AND_STICKERS", "USE_APPLICATION_COMMANDS", "REQUEST_TO_SPEAK", "MANAGE_THREADS", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS", "USE_EXTERNAL_STICKERS", "SEND_MESSAGES_IN_THREADS", "START_EMBEDDED_ACTIVITIES"]
            for (var i = 0; i < permessi.length; i++)
                if (utente.permissions.has(permessi[i]))
                    elencoPermessi += `- ${permessi[i]}\r`
        }
        var embed = new Discord.EmbedBuilder()
            .setTitle(utente.user.tag)
            .setDescription("Tutte le info di questo utente")
            .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
            .addFields([
                { name: 'User id', value: `\`\`\`js\n${utente.user.id}\`\`\`` },
                { name: 'Status', value: `\`\`\`js\n${utente.presence ? utente.presence.status : "offline"}\`\`\`` },
                { name: 'Is a bot?', value: `\`\`\`js\n${utente.user.bot ? "Yes" : "No"}\`\`\`` },
                { name: 'Account created', value: `\`\`\`js\n${utente.user.createdAt.toDateString()} \`\`\`` },
                { name: 'Joined this server', value: `\`\`\`js\n${utente.joinedAt.toDateString()}\`\`\`` },
                { name: 'Permissions', value: `\`\`\`js\n${elencoPermessi}\`\`\`` },
                { name: 'Roles', value: `\`\`\`js\n${utente.roles.cache.map(ruolo => ruolo.name).join("\r")}\`\`\`` },
                
                
            ])
            .setColor(configs.embed.color.green)
        interaction.reply({ embeds: [embed] })
    }
}