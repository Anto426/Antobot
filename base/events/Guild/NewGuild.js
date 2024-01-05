const { writecommand } = require("../../../function/commands/writecommands")

module.exports = {
    name: "NewGuild",
    typeEvent: "guildCreate",
    async execute(guild) {

        new writecommand().commandoneguild(guild).catch(() => { })

    }

}