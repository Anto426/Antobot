const { serverinfoembed } = require("../../embeds/commands/general/serverinfoembed")
const cguild = require("./../../settings/guild.json")
module.exports = {
    name: "serverinfo",
    permisions: [],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
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