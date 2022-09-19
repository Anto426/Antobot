const errmsg = require("../msg/errormsg")
const configs = require("./../../index")
async function banf(interaction, member, reason) {
    try {
        member.ban({
            reason: reason
        });
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Utente bannato")
            .setDescription("<@" + member + ">" + " bannato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
        const embeddm = new configs.Discord.EmbedBuilder()
            .setTitle("Sei stato bannato dal server mi dispiace,per la prossima volta impara a rispettare le regole")
            .setDescription("<@" + member + ">" + " bannato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        member.send({ embeds: [embeddm] }).catch(() => { errmsg.dmmessage(interaction) })
    } catch (err) {
        console.error(err)
        errmsg.genericmsg(interaction)
    }
}

async function kickf(interaction, member) {
    try {
        member.kick();
        let frasi = ["La prossima volta rispetta le regole coglione " + "<@" + member + ">" + " bannato"]
        var x = Math.floor(Math.random() * frasi.length);
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Utente bannato")
            .setDescription(frasi[x])
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
    } catch (err) {
        console.error(err)
        errmsg.genericmsg(interaction)
    }


}



module.exports = {
    banf: banf,
    kickf: kickf

}