const { json } = require("@distube/yt-dlp")
const { jsonwu } = require("../../functions/json/jsonf")

module.exports = {
    name: "allowolc",
    permisions: [],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: true,
    test: false,
    data: {
        name: "allowolc",
        description: "Aggiunto alla white list ",
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
            jsonwu("./settings/whitelist.json", interaction.options.getMember("user").id)
            interaction.member.reply(interaction.options.getMember("user") + " aggiunto alla whitelist")
        } catch (err) { genericerr(interaction, err) }
    }
}