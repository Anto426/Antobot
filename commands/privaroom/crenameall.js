let functions = require("./../../function/roomandticket/function")
module.exports = {
    name: "crenameall",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "crenameall",
        description: "Rinomina tutte le stanze",
        options: [{
            name: "name",
            description: "Nuovo nome ",
            type: 3,
            required: true
        }]
    },
    execute(interaction) {
        let name = interaction.options.getString("name")

        functions.rename(interaction, name, null, "setName", "name")
    }
}