const { avatarembed } = require("../../embeds/commands/general/avatarembed")
const { genericerr } = require("../../embeds/err/generic")
const cguild = require("./../../settings/guild.json")
module.exports = {
    name: "avatar",
    permisions: [],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
    position: false,
    test: false,
    data: {
        name: "avatar",
        description: "avatar di un utente",
        options: [{
            name: "user",
            description: "L'utente interessato",
            type: 6,
            required: false
        }]
    },
    execute(interaction) {
        try {
            var utente = interaction.options.getMember("user")
            if (!utente)
                utente = interaction.member
            avatarembed(interaction, utente)
        } catch (err) { genericerr(interaction, err) }
    }
}