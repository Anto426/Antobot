const cguild = require("../../settings/guild.json")
const { AttachmentBuilder } = require("discord.js")
async function congratulatioembed(festa) {

    try {

        const message = `
        ╚»★${festa.title}★«╝
@everyone 
@here
${festa.description}
        
        
        `
        const attachment = new AttachmentBuilder(festa.image);
        client.guilds.cache.find(x => x.id == cguild["Anto's  Server"].id).channels.cache.get(cguild["Anto's  Server"].channel.info.annunce).send(
            {
                content: message,
                files: [attachment],
            })
    } catch { }
}

module.exports = {
    congratulatioembed
}