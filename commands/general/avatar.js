const { avatarembed } = require("../../embeds/commands/general/avatarembed")

module.exports = {
    name: "avatar",
    permisions: [],
    allowedchannels: [],
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
        } catch { }
    }
}