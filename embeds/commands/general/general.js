const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require("discord.js")
const cembed = require("./../../../settings/embed.json")
const cgame = require("./../../../settings/games.json")
const moment = require('moment');
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
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }) || cembed.image.notimmage)
            .setColor(cembed.color.verde)
        interaction.reply({ embeds: [embed] })
    } catch (err) { genericerr(interaction, err) }
}


async function avatarembed(interaction, member) {
    try {


        const banner = new ButtonBuilder()
            .setCustomId('banner')
            .setLabel('Banner')
            .setStyle(ButtonStyle.Success);

        let row = new ActionRowBuilder()
            .addComponents(
                banner
            );


        var embed = new EmbedBuilder()
            .setTitle(member.user.tag)
            .setDescription("L'avatar di questo utente")
            .setColor(cembed.color.verde)
            .setImage(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }) || cembed.image.notimmage)
        interaction.reply({ embeds: [embed], components: [row] })
    } catch (err) { genericerr(interaction, err) }
}

async function serverinfoembed(interaction) {
    try {
        let countingonline = await interaction.guild.members.cache.filter(x => x.presence?.status == 'online').size
        let countingidle = await interaction.guild.members.cache.filter(x => x.presence?.status == 'idle').size
        const embed = new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setColor(cembed.color.verde)
            .setDescription(`Ecco tutte le info  su ${interaction.guild.name} :`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || cembed.image.notimmage)
            .addFields([
                { name: `:id: Server id:`, value: `\`\`\`\n${interaction.guild.id}\`\`\`\n` },
                { name: ':crown: Owner', value: `\`\`\`\n${interaction.guild.members.cache.find(x => x.id == interaction.guild.ownerId).user.username}\`\`\`` },
                {
                    name: `:people_hugging: Members:`, value: ` 
Membri tot: \`\`\`\n${interaction.guild.memberCount.toString()}\`\`\` 
:robot: Bot: \`\`\`\n${interaction.guild.members.cache.filter(x => x.user.bot).size.toString()}\`\`\`       
:bust_in_silhouette: Utenti:\`\`\`\n${interaction.guild.members.cache.filter(x => !x.user.bot).size.toString()}\`\`\`      
<:online:896799521521168384> online: \`\`\`\n${countingonline + countingidle}\`\`\`
                  ` },
                {
                    name: `:bar_chart: Channels:`, value: `

Canali tot:\`\`\`\n${interaction.guild.channels.cache.filter(x => x.type == ChannelType.GuildVoice || x.type == ChannelType.GuildText).size.toString()} \`\`\`
:voice: Canali vocali:\`\`\`\n${interaction.guild.channels.cache.filter(x => x.type == ChannelType.GuildVoice).size.toString()}\`\`\` 
:ledger: Canali testuali:\`\`\`\n ${interaction.guild.channels.cache.filter(x => x.type == ChannelType.GuildText).size.toString()} \`\`\`
                                  ` },
                { name: `:date: Server created:`, value: `\`\`\`\n${moment(interaction.guild.createdAt).locale('it').format('LL')}\`\`\`` },
                { name: `:star: Boost level:`, value: `\`\`\`\n${interaction.guild.premiumTier}\`\`\`` }
            ])
        interaction.reply({ embeds: [embed] })
    } catch (err) {
        console.log(err)
        genericerr(interaction, err)
    }
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

async function servermcembed(interaction, row) {
    try {
        let embed = new EmbedBuilder()
            .setTitle(cgame.mc.server[interaction.values[0]].emoji + " " + interaction.values[0])
            .setDescription("Ecco ip del tuo server:")
            .addFields({ name: `ip:`, value: `\`\`\`\n${cgame.mc.server[interaction.values[0]].ip.toString()}\n\`\`\`` })
            .setThumbnail(cgame.mc.server[interaction.values[0]].image)
            .setColor(cembed.color.viola)
        interaction.update({ embeds: [embed], components: [row] })
    } catch (err) {
        console.log(err)
        genericerr(interaction, err)
    }
}






module.exports = { pingembed, avatarembed, serverinfoembed, userinfoembed, servermcembed }