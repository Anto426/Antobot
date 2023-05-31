const { EmbedBuilder, ChannelType } = require("discord.js")
const moment = require('moment');
const cembed = require("../../../settings/embed.json")
const { genericerr } = require("../../err/generic");

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

module.exports = { serverinfoembed }