const { jsonwu } = require("../../functions/json/jsonf")
const { genericerr } = require('../../embeds/err/generic');
const cguild = require("./../../settings/guild.json")
module.exports = {
    name: "allowolc",
    permisions: [],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: false,
    test: false,
    data: {
        name: "allowolc",
        description: "Aggiunge persona alla white list per le olimpiadi ",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: true
        }
        ]
    },
    execute(interaction) {
        try {
            if (jsonwu("./settings/whitelist.json", "list", interaction.options.getMember("user").id)) {
                interaction.reply(interaction.options.getMember("user").user.tag + " aggiunto con successo ")
            } else {
                interaction.reply(interaction.options.getMember("user").user.tag + " gia presente nella lista")
            }
        } catch (err) { genericerr(interaction, err) }
    }
}