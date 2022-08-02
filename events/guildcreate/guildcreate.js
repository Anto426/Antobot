module.exports = {

    name: "guildCreate",
    async execute(guild) {

        client.commands.forEach(command => {
            guild.commands.create(command.data).catch()

        })

        if (guild.roles.cache.find(x => x.name == "MutedA")) return
        let muted = await guild.roles.create({
            name: "MutedA",
            permissions: [""]
        })

        guild.channels.cache.forEach((channel) => {
            channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false })
        })

    }
}