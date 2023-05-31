const { EmbedBuilder } = require("discord.js")
const moment = require('moment');
const cembed = require("../../../settings/embed.json")
const { genericerr } = require("../../err/generic");


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










module.exports = {  userinfoembed }