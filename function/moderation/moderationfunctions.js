let errmsg = require("./../error/errormsg")
async function banf(interaction, member) {
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
    } catch {

        errmsg.message(interaction)
    }
}

async function kickf(interaction, member){


    
}



module.exports={
    banf:banf, 
    kickf:kickf
    
}