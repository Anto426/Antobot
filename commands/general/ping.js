const { pingembed } = require("../../embeds/commands/general/pingembed")


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