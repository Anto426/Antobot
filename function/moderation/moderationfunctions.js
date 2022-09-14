const errmsg = require("./../error/errormsg")
const configs = require("./../../index")
async function banf(interaction, member, reason) {
    try {

        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Utente bannato")
            .setDescription("<@" + member + ">" + " bannato")
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.green)
            .addFields([
                { name: 'Reason', value: `\`\`\`\n ${reason} \`\`\`` },
            ])
        interaction.reply({ embeds: [embed] })
    } catch (err) {
        console.error(err)
        errmsg.message(interaction)
    }
}

async function kickf(interaction, member) {



}



module.exports = {
    banf: banf,
    kickf: kickf

}