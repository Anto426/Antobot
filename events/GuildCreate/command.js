const { comandregisteroneguild } = require("./../../functions/client/comandregister")
module.exports = {
    name: "guildCreate",
    async execute(guild) {
        comandregisteroneguild(guild)
    }
}