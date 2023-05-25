const cguild = require("./../../settings/guild.json")
async function welcomeembed(member,cout, canavas) {

    try {

        const message = `
        ╚»★Benvenuto su ${member.guild.name}★«╝
${member} benvenuto su  ${member.guild.name} spero che ti possa trovare sei il nostro ${cout}
        
        
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

module.exports = {
    welcomeembed
}