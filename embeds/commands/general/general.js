const { EmbedBuilder, ChannelType } = require("discord.js")
const axios = require('axios');
const moment = require('moment');


const cembed = require("./../../../settings/embed.json")
const cgame = require("./../../../settings/games.json")
const { genericerr } = require("../../err/error");
const { createrowavatar, createrowbanner } = require("../../../functions/row/createrow");
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

        let row = createrowbanner(interaction, member)

        var embed = new EmbedBuilder()
            .setTitle(member.user.tag)
            .setDescription("L'avatar di questo utente")
            .setColor(cembed.color.verde)
            .setImage(member.user.displayAvatarURL({
                dynamic: true,
                format: "png",
                size: 512
            }) || cembed.image.notimmage)
        if (interaction.isChatInputCommand())
            interaction.reply({ embeds: [embed], components: [row] })
        else
            interaction.update({ embeds: [embed], components: [row] })

    } catch (err) { genericerr(interaction, err) }
}
async function bannerembed(interaction, member) {
    try {
        let row = createrowavatar(interaction, member)
        axios.get(`https://discord.com/api/v10/users/${member.id}`, {
            headers: {
                Authorization: `Bot ${client.token}`
            }
        })
            .then(response => {
                const { banner, accent_color } = response.data
                if (banner) {
                    const extension = banner.startsWith("a_") ? `.gif` : `.png`;
                    const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=512`
                    console.log(url)
                    var embed = new EmbedBuilder()
                        .setTitle(member.user.tag)
                        .setDescription("Il banner di questo utente")
                        .setColor(cembed.color.verde)
                        .setImage(url)
                    interaction.update({ embeds: [embed], components: [row] })
                } else if (accent_color) { }
            })

    } catch (err) {
        console.log(err)
        genericerr(interaction, err)
    }
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
:mega:  Canali vocali:\`\`\`\n${interaction.guild.channels.cache.filter(x => x.type == ChannelType.GuildVoice).size.toString()}\`\`\` 
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
                { name: ':bust_in_silhouette: User id', value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: ':online: Status', value: `\`\`\`\n${member.presence ? member.presence.status : "offline"}\`\`\`` },
                { name: ':robot: Is a bot?', value: `\`\`\`\n${member.user.bot ? "Yes" : "No"}\`\`\`` },
                { name: ':date: Account created', value: `\`\`\`\n${moment(member.user.createdAt).locale('it').format('LL')} \`\`\`` },
                { name: ':date: Joined this server', value: `\`\`\`\n${moment(member.joinedAt).locale('it').format('LL')}\`\`\`` },
                { name: ':star: Permissions', value: `\`\`\`\n${elencoPermessi.join("\n")}\`\`\`` },
                { name: ':gear: Roles', value: `\`\`\`\n${member.roles.cache.map(ruolo => ruolo.name).join("\r")}\`\`\`` },


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








module.exports = { pingembed, avatarembed, bannerembed, serverinfoembed, userinfoembed, servermcembed }