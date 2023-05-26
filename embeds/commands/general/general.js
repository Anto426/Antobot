const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../../settings/embed.json")
const { genericerr } = require("../../err/error")
async function pingembed(interaction) {
    try {
        let embed = new EmbedBuilder()
            .addFields([
                { name: `:lacrosse: Pong`, value: `\`\`\`\n${client.ws.ping}ms\`\`\`` },
                { name: `:computer: Ram`, value: `\`\`\`\n${(process.memoryUsage().heapUsed / 1048576).toFixed(0)}mb\`\`\`` },
                { name: `:timer: Time`, value: `\`\`\`\n${global.timeonc}\`\`\`` },

            ])
            .setTitle("Pong ecco il ping del bot")
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch (err) { genericerr(interaction, err) }
}


async function avatarembed(interaction) {
    try {
        var embed = new EmbedBuilder()
            .setTitle(interaction.memmber.user.tag)
            .setDescription("L'avatar di questo utente")
            .setColor(cembed.color.verde)
            .setImage(interaction.memmber.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }))
        interaction.reply({ embeds: [embed] })
    } catch (err) { genericerr(interaction, err) }
}

async function serverinfoembed(interaction) {
    try {
        let countingonline = await interaction.guild.members.cache.filter(x => x.presence?.status == 'online').size
        let countingidle = await interaction.guild.members.cache.filter(x => x.presence?.status == 'idle').size
        const embed = new EmbedBuilder()
            .setTitle(server.name)
            .setColor(cembed.color.verde)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL({ dynamic: true }) || configs.settings.embed.images.noimmage)
            .addFields([
                { name: 'Owner', value: `\`\`\`\n${interaction.guild.members.cache.get(server.ownerId).nickname}\`\`\`` },
                { name: `Server id:`, value: `\`\`\`\n${interaction.guil.id}\`\`\`` },
                {
                    name: `Members:`, value: ` \`\`\`\n  
Membri tot: ${interaction.guild.memberCount.toString()}
                  
Bot:${interaction.guild.members.cache.filter(x => x.user.bot).size.toString()}
                  
Utenti:${interaction.guild.members.cache.filter(x => !x.user.bot).size.toString()}
                  
online: ${countingonline + countingidle}      
                  \`\`\`` },
                {
                    name: `Channels:`, value: `\`\`\`\n

Canali tot:${interaction.guild.channels.cache.filter(x => x.type == "GUILD_VOICE" || x.type == "GUILD_TEXT").size.toString()}
                  
Canali vocali:${interaction.guild.channels.cache.filter(x => x.type == "GUILD_VOICE").size.toString()} || Canali testuali: ${server.channels.cache.filter(x => x.type == "GUILD_TEXT").size.toString()}
                                   \`\`\`` },
                { name: `Server created:`, value: `\`\`\`\n${interaction.guild.id}\`\`\`` },
                { name: `Boost level Level:`, value: `\`\`\`\n${interaction.guild.id}\`\`\`` }
            ])
        interaction.reply({ embeds: [embed] })
    } catch (err) { genericerr(interaction, err) }
}


async function userinfoembed(interaction, member, elencoPermessi) {
    try {
        let embed = new EmbedBuilder()
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
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch (err) { genericerr(interaction, err) }
}




module.exports = { pingembed, avatarembed, serverinfoembed, userinfoembed }