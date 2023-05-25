const cguild = require("./../../settings/guild.json")
const { EmbedBuilder } = require("discord.js")
const cembed = require("./../../settings/embed.json")
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
        member.roles.add(member.guild.roles.cache.get(cguild[member.guild.name].role.user))
    } catch { }
}
async function logaddmember(member, cout) {

    try {
        const embed = new EmbedBuilder()
            .setTitle("Nuovo Utente")
            .addFields(
                { name: ":bust_in_silhouette: name", value: member.user.tag },
                { name: ":id: id", value: member.user.id },
                { name: ":timer: ora ", value: `${new Date().toLocaleTimeString()}\n${new Date().toLocaleDateString()}` },
                { name: ":1234: mebro", value: `${cout} membro` }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setColor(cembed.color.verde)
        sendtoalllog({ embeds: [embed], })

    } catch { }
}
module.exports = {
    welcomeembed,
    logaddmember
}