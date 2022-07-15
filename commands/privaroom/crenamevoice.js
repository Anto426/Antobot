let functions = require("./../../function/roomandticket/function")
module.exports = {
    name: "crenamevoice",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "crenamevoice",
        description: "Rinomina stanza testuale",
        options: [{
            name: "name",
            description: "Nuovo nome ",
            type: "STRING",
            required: true
        }]
    },
    execute(interaction) {

        let name = interaction.options.getString("name")

        functions.rename(interaction, name, "GUILD_VOICE", "setName", "name")
    }
}