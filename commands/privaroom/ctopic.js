let functions = require("./../../function/roomandticket/function")
module.exports = {
    name: "ctopics",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "ctopics",
        description: "Cambia il topic della stanza testuale",
        options: [{
            name: "topic",
            description: "Nuovo nome ",
            type: "STRING",
            required: true
        }]
    },
    execute(interaction) {

        let topic = interaction.options.getString("topic")

        functions.rename(interaction, topic, "GUILD_TEXT", "setTopic", "name")
    }
}