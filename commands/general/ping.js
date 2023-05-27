const { pingembed } = require("../../embeds/commands/general/general")

module.exports = {
    name: "ping",
    permisions: [],
    allowedchannels: [],
    position: false,
    test: false,
    data: {
        name: "ping",
        description: "Ping è un comando di rete utilizzato per testare la connettività e misurare la latenza tra due dispositivi."
    },
    execute(interaction) {
        pingembed(interaction)
    }
}