const { shashcomandregisteroneguild } = require("../../function/configs/comandregister")
const { createrolebasebotf } = require("../../function/configs/roleconfigs")

module.exports = {

    name: "guildCreate",
    async execute(guild) {
        createrolebasebotf()
        shashcomandregisteroneguild(guild)
    }
}