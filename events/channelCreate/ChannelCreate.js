const { PermissionsBitField } = require("discord.js")
module.exports = {
    name: "channelCreate",
    async execute(channel) {
        let muted = channel.guild.roles.cache.find(x => x.name == "MutedA")
        if (muted)
            channel.permissionOverwrites.create(muted.id, {
                [PermissionsBitField.Flags.SendMessages]: false
            }).catch(() => { })

    }
}