const cguild = require("./../../setting/guild.json")
const { ChannelType } = require("discord.js")
const { comandregisteroneguild } = require("./../../functions/client/comandregister")
module.exports = {
    name: "guildCreate",
    async execute(guild) {
        comandregisteroneguild(guild)
    }
}