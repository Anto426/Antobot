const configs = require("./../../index")
module.exports = {

    name: "guildCreate",
    async execute(guild) {

        configs.client.commands.forEach(command => {
            guild.commands.create(command.data).catch()

        })
        let muted = guild.roles.cache.find(x => x.name == "MutedA")
        if (muted) {
            muted = await guild.roles.create({
                name: "MutedA",
                permissions: [""]
            })
        }
        guild.channels.cache.forEach((channel) => {
            channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false }).catch(() => { })
        })

    }
}