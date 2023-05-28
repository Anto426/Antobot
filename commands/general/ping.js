const { pingembed } = require("../../embeds/commands/general/general")

module.exports = {
    name: "ping",
    permisions: [],
    allowedchannels: [],
    position: false,
    test: false,
    data: {
        name: "ping",
        description: "test latenza bot"
    },
    execute(interaction) {
        pingembed(interaction)
    }
}