const { pingembed } = require("../../embeds/commands/general/pingembed")
const { genericerr } = require("../../embeds/err/generic")
const cguild = require("./../../settings/guild.json")

module.exports = {
    name: "ping",
    permisions: [],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: false,
    test: false,
    data: {
        name: "ping",
        description: "test latenza bot"
    },
    execute(interaction) {
        try {
            pingembed(interaction)
        } catch (err) { genericerr(interaction, err) }

    }
}