const { EmbedBuilder, NewsChannel } = require("discord.js")
const cembed = require("./../../settings/embed.json")
const { sendtoprlog } = require("../../functions/log/sendtolog")
async function logjoinvocal(member, channel) {

    try {
        const embed = new EmbedBuilder()
            .setTitle(`Utente entrato in un canale vocale`)
            .addFields(
                { name: ":bust_in_silhouette: name", value: `\`\`\`\n${member.user.tag}\`\`\`` },
                { name: ":id: ID UTENTE ", value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: ":mega: CANALE", value: `\`\`\`\n${channel.name}\`\`\`` },
                { name: ":id: ID CANALE", value: `\`\`\`\n${channel.id}\`\`\`` },
                { name: ":timer: ORA ", value: `\`\`\`\n${new Date().toLocaleString('it-IT', optionsdate)}\n${new Date().toLocaleDateString('it-IT', optionsdate)}\`\`\`` },
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor(cembed.color.verde)
        sendtoprlog({ embeds: [embed], })

    } catch { }
}

async function logchangevocal(member, newchannel, oldchannel) {

    try {
        const embed = new EmbedBuilder()
            .setTitle(`Utente ha cambiato canale vocale`)
            .addFields(
                { name: ":bust_in_silhouette: NAME", value: `\`\`\`\n${member.user.tag}\`\`\`` },
                { name: ":id: ID UTENTE", value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: ":mega: VECCHIO CANALE", value: `\`\`\`\n${oldchannel.name}\`\`\`` },
                { name: ":id: ID VECCHIO CANALE", value: `\`\`\`\n${oldchannel.id}\`\`\`` },
                { name: ":mega: NUOVO CANALE", value: `\`\`\`\n${newchannel.name}\`\`\`` },
                { name: ":id: ID NUOVO CANALE", value: `\`\`\`\n${newchannel.id}\`\`\`` },
                { name: ":timer: ORA ", value: `\`\`\`\n${new Date().toLocaleString('it-IT', optionsdate)}\n${new Date().toLocaleDateString('it-IT', optionsdate)}\`\`\`` },
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor(cembed.color.giallo)
        sendtoprlog({ embeds: [embed], })

    } catch { }
}
async function logforcechangevocal(member, mover, newchannel, oldchannel) {

    try {
        const embed = new EmbedBuilder()
            .setTitle(`Utente spostato`)
            .addFields(
                { name: ":bust_in_silhouette: NAME", value: `\`\`\`\n${member.user.tag}\`\`\`` },
                { name: ":id: ID UTENTE", value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: ":mega: VECCHIO CANALE", value: `\`\`\`\n${oldchannel.name}\`\`\`` },
                { name: ":id: ID VECCHIO CANALE", value: `\`\`\`\n${oldchannel.id}\`\`\`` },
                { name: ":mega: NUOVO CANALE", value: `\`\`\`\n${newchannel.name}\`\`\`` },
                { name: ":id: ID NUOVO CANALE", value: `\`\`\`\n${newchannel.id}\`\`\`` },
                { name: ":timer: ORA ", value: `\`\`\`\n${new Date().toLocaleString('it-IT', optionsdate)}\n${new Date().toLocaleDateString('it-IT', optionsdate)}\`\`\`` },
                { name: ":bust_in_silhouette: DA", value: `\`\`\`\n${mover}\`\`\`` },

            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor(cembed.color.rosso)
        sendtoprlog({ embeds: [embed], })

    } catch { }
}
async function logquitvocal(member, oldchannel) {

    try {
        const embed = new EmbedBuilder()
            .setTitle(`Utente uscito dalla vocale`)
            .addFields(
                { name: ":bust_in_silhouette: NAME", value: `\`\`\`\n${member.user.tag}\`\`\`` },
                { name: ":id: ID UTENTE", value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: ":mega: VECCHIO CANALE", value: `\`\`\`\n${oldchannel.name}\`\`\`` },
                { name: ":id: ID VECCHIO CANALE", value: `\`\`\`\n${oldchannel.id}\`\`\`` },
                { name: ":timer: ORA ", value: `\`\`\`\n${new Date().toLocaleString('it-IT', optionsdate)}\n${new Date().toLocaleDateString('it-IT', optionsdate)}\`\`\`` },

            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor(cembed.color.rosso)
        sendtoprlog({ embeds: [embed], })

    } catch { }
}
module.exports = {
    logjoinvocal,
    logchangevocal,
    logquitvocal,
    logforcechangevocal
}

