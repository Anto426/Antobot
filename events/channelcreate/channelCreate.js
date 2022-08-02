module.exports = {
    name: "channelCreate",
    async execute(channel) {
        let muted = channel.guild.roles.cache.find(x => x.name == "MutedA")
        if (!muted) {
            muted = await channel.guild.roles.create({
                name: "MutedA",
                permissions: [""]
            })
        }
        channel.guild.channels.cache.forEach((channel) => {
            channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false }).catch(() => {})
        })
    }
}