const { servermcembeddef } = require('../../embeds/commands/general/servermcembed');
const { genericerr } = require('../../embeds/err/generic');
const { createrowmc } = require('../../functions/row/createrow');
const cguild = require("./../../settings/guild.json")
module.exports = {
    name: "servermc",
    permisions: [],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: false,
    test: false,
    data: {
        name: "servermc",
        description: "comando per ottenere ip di minecraft"
    },
    execute(interaction) {

        try {
            let server = []
            let row = createrowmc(interaction, server)
            servermcembeddef(interaction, row, server)
        } catch (err) { genericerr(interaction, err) }

    }
}