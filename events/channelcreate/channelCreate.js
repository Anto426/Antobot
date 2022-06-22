module.exports = {
    name: "channelCreate",
    async execute(channel) {
        let muted = channel.guild.roles.cache.find(x => x.name == "MutedA")
        channel.guild.channels.cache.forEach((channel) => {
            channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false })
        })
    }
}