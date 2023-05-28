const { EmbedBuilder, ChannelType, AttachmentBuilder } = require("discord.js")
const { createCanvas } = require('canvas')
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
                { name: `:lacrosse: PONG`, value: `\`\`\`\n${client.ws.ping}ms\`\`\`` },
                { name: `:computer: RAM USATA`, value: `\`\`\`\n${(process.memoryUsage().heapUsed / 1048576).toFixed(0)}mb\`\`\`` },
                { name: `:timer: TEMPO ACCESO`, value: `\`\`\`\n${global.timeonc}\`\`\`` },

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
        else {
            interaction.update({ embeds: [embed], files: [], components: [row] })
        }
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
            .then(async response => {
                var embed = new EmbedBuilder()
                    .setTitle(member.user.tag)
                    .setDescription("Il banner di questo utente")
                    .setColor(cembed.color.verde)

                const { banner, accent_color, banner_color } = response.data
                if (banner) {
                    const extension = banner.startsWith("a_") ? `.gif` : `.png`;
                    const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=512`
                    embed.setImage(url)
                    interaction.update({ embeds: [embed], components: [row] })
                } else {
                    console.log(accent_color || banner_color)
                    if (accent_color || banner_color) {
                        let canvas = await createCanvas(1024, 408)
                        let ctx = await canvas.getContext('2d')

                        ctx.fillStyle = accent_color || banner_color
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'canvas.png' })
                        embed
                            .setImage('attachment://canvas.png');
                        interaction.update({ embeds: [embed], files: [attachment], components: [row] })
                    }
                }

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
                { name: `:id: SERVER ID:`, value: `\`\`\`\n${interaction.guild.id}\`\`\`\n` },
                { name: ':crown: OWNER', value: `\`\`\`\n${interaction.guild.members.cache.find(x => x.id == interaction.guild.ownerId).user.username}\`\`\`` },
                {
                    name: `:people_hugging: MEMBERS:`, value: ` 
MEMBRI TOT: \`\`\`\n${interaction.guild.memberCount.toString()}\`\`\` 
:robot: BOT: \`\`\`\n${interaction.guild.members.cache.filter(x => x.user.bot).size.toString()}\`\`\`       
:bust_in_silhouette: UTENTI:\`\`\`\n${interaction.guild.members.cache.filter(x => !x.user.bot).size.toString()}\`\`\`      
<:online:1112363943957115001> ONLINE: \`\`\`\n${countingonline + countingidle}\`\`\`
                  ` },
                {
                    name: `:bar_chart: CANALI:`, value: `

CANALI TOT:\`\`\`\n${interaction.guild.channels.cache.filter(x => x.type == ChannelType.GuildVoice || x.type == ChannelType.GuildText).size.toString()} \`\`\`
:mega:  CANALI VOCALI:\`\`\`\n${interaction.guild.channels.cache.filter(x => x.type == ChannelType.GuildVoice).size.toString()}\`\`\` 
:ledger: CANALI TESTUALI:\`\`\`\n ${interaction.guild.channels.cache.filter(x => x.type == ChannelType.GuildText).size.toString()} \`\`\`
                                  ` },
                { name: `:date: SERVER CREATO:`, value: `\`\`\`\n${moment(interaction.guild.createdAt).locale('it').format('LL')}\`\`\`` },
                { name: `:star: LIVELLO BOOST:`, value: `\`\`\`\n${interaction.guild.premiumTier}\`\`\`` }
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
                { name: ':bust_in_silhouette: USER ID', value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: '<:online:1112363943957115001> STATUS', value: `\`\`\`\n${member.presence ? member.presence.status : "offline"}\`\`\`` },
                { name: ':robot: BOT ?', value: `\`\`\`\n${member.user.bot ? "Yes" : "No"}\`\`\`` },
                { name: ':date: ACCOUNT CREATO', value: `\`\`\`\n${moment(member.user.createdAt).locale('it').format('LL')} \`\`\`` },
                { name: ':date: ENTRATO NEL SERVER', value: `\`\`\`\n${moment(member.joinedAt).locale('it').format('LL')}\`\`\`` },
                { name: ':star: PERMESSI', value: `\`\`\`\n${elencoPermessi.join("\n")}\`\`\`` },
                { name: ':gear: RUOLI', value: `\`\`\`\n${member.roles.cache.map(ruolo => ruolo.name).join("\r")}\`\`\`` },


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