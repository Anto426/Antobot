const { evalsembed, evalfembed } = require('../../embeds/commands/bot/eval')
module.exports = {
    name: "eval",
    permisions: [],
    allowedchannels: [],
    position: false,
    test: false,
    data: {
        name: "eval",
        description: "Comando per eseguire del codice js",
        options: [{
            name: "comand",
            description: "comando",
            type: 3,
            required: true
        }]
    },
    async execute(interaction) {

        let args = interaction.options.getString("comand")

        try {
            evaled = await eval(args);
            evalsembed(interaction)

        } catch (error) {
            console.error(error.toString());
            evalfembed(interaction, args, error)
        }

    }
}