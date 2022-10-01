const configs = require("./../../index")
async function createrolebasebotf() {
    let muted = guild.roles.cache.find(x => x.name == "MutedA")
    if (!muted) {
        muted = await guild.roles.create({
            name: "MutedA",
            permissions: [""],
            position: 0
        })
    }
    guild.channels.cache.forEach((channel) => {
        channel.permissionOverwrites.edit(muted, { SEND_MESSAGES: false }).catch(() => { })
    })
}

module.exports={
    createrolebasebotf:createrolebasebotf
}