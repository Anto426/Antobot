const { evalsembed, evalfembed } = require('../../embeds/commands/bot/evalembed')
const cguild = require("./../../settings/guild.json")
module.exports = {
    name: "eval",
    permisions: [],
    allowedchannels: cguild['Anto\'s  Server'].channel.allowchannel,
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