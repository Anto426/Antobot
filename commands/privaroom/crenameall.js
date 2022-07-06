let functions = require("./../../function/globalfunction")
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
            type: "STRING",
            required: true
        }]
    },
    execute(interaction) {
        let name = interaction.options.getString("name")

        functions.rename(interaction, name, null, "setName", "name")
    }
}