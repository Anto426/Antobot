const { servermcembeddef } = require('../../embeds/commands/general/servermcembed');
const { createrowmc } = require('../../functions/row/createrow');
module.exports = {
    name: "servermc",
    permisions: [],
    allowedchannels: [],
    position: false,
    test: false,
    data: {
        name: "servermc",
        description: "comando per ottenere ip di minecraft"
    },
    execute(interaction) {
        let server = []
        let row = createrowmc(interaction, server)
        servermcembeddef(interaction, row, server)
    }
}