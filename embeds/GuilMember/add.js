const cguild = require("./../../settings/guild.json")
const { AttachmentBuilder } = require("discord.js")
const cembed = require("./../../settings/embed.json")
async function welcomeembed(member, cout, canavas) {

    try {
        const message = `
        ╚»★Benvenuto su ${member.guild.name}★«╝
${member} benvenuto su  ${member.guild.name} spero che ti possa trovare sei il nostro ${cout} memebro
        
        
        `
        client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).channels.cache.get(cguild["Anto's  Server"].channel.info.welcome).send(
            {
                content: message,
                files: [canavas],
            })
        member.roles.add(member.guild.roles.cache.get(cguild[member.guild.name].role.user))
    } catch (err) {
        console.log(err)
    }
}
async function logmember(member, cout, canavas) {

    try {
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Mese è 0-based
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        const embed = new AttachmentBuilder()
            .setTitle("Nuovo Utente")
            .addFields(
                { name: ":bust_in_silhouette: name", value: member.user.tag },
                { name: "id", value: member.user.tag },
                { name: ":time: ora ", value: formattedDate }
            )
            .setThumbnail(festa.image)
            .setColor(cembed.color.verde)
        client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).channels.cache.get(cguild["Anto's  Server"].channel.bot["private-log"]).send(
            {
                embed: embed,
            })
        client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).channels.cache.get(cguild["Anto's  Server"].channel.bot["public-log"]).send(
            {
                embed: embed,
            })

    } catch (err) {
        console.log(err)
    }
}
module.exports = {
    welcomeembed
}