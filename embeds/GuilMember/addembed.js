const cguild = require("../../settings/guild.json")
const { EmbedBuilder } = require("discord.js")
const cembed = require("../../settings/embed.json")
const { sendtoalllog } = require("../../functions/log/sendtolog")
async function welcomeembed(member, cout, canavas) {

    try {
        const message = `
        ╚»★Benvenuto su ${member.guild.name}★«╝
${member} benvenuto su  ${member.guild.name} spero che ti possa trovare bene sei il nostro ${cout} memebro
        
        
        `
        client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).channels.cache.get(cguild["Anto's  Server"].channel.info.welcome).send(
            {
                content: message,
                files: [canavas],
            })
        
    } catch { }
}
async function logaddmember(member, cout) {

    try {
        const embed = new EmbedBuilder()
            .setTitle("Nuovo Utente")
            .addFields(
                { name: ":bust_in_silhouette: NAME", value: `\`\`\`\n${member.user.tag}\n\`\`\`` },
                { name: ":id: ID", value: `\`\`\`\n${member.user.id}\`\`\`` },
                { name: ":timer: ORA ", value: `\`\`\`\n${new Date().toLocaleString('it-IT', optionsdate)}\n\`\`\`` },
                { name: ":1234: MEMBRO", value: `\`\`\`\n${cout} membro\`\`\`` }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }) || cembed.image.notimmage)
            .setColor(cembed.color.verde)
        sendtoalllog({ embeds: [embed], })

    } catch { }
}
module.exports = {
    welcomeembed,
    logaddmember
}