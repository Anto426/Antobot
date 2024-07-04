const { comandbembed } = require("../../../embed/base/command")
const setting = require("../../../setting/settings.json")

module.exports = {
    name: "eval",
    permisions: [],
    allowedchannels: false,
    OnlyOwner: true,
    position: false,
    test: false,
    see: true,
    data: {
        name: "eval",
        description: "Esegui i comandi js",
        options: [{
            name: "comand",
            description: "comando da eseguire",
            type: 3,
            required: true
        }]
    },

    async execute(interaction) {
        try {

            let embedmsg = new comandbembed()
            embedmsg.init().then().catch(() => {

            })


        } catch (err) {
            console.log(err)
        }

    }
}