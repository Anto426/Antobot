const { serverinfoembed } = require('../../embeds/commands/general/general');
module.exports = {
    name: "serverinfo",
    permisions: [],
    allowedchannels: [],
    position: false,
    test: false,
    data: {
        name: "serverinfo",
        description: "comando per avere informazioni sul server"
    },
    async execute(interaction) {
        serverinfoembed(interaction)
    }
}