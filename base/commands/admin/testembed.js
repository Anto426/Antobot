const { eventbembed } = require("../../../embed/base/events")
const { errembed } = require("../../../embed/err/errembed")

module.exports = {
    name: "testembed",
    permisions: [],
    allowedchannels: true,
    OnlyOwner: true,
    position: false,
    test: false,
    see: false,
    data: {
        name: "testembed",
        description: "Testa gli embed"
    },
    execute(interaction) {
        try {




        } catch (err) {
            console.log(err)
        }

    }
}