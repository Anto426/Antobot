const { PermissionsBitField } = require('discord.js')
const { inspect } = require(`util`)
const configs = require("./../../index")
module.exports = {
    name: "eval",
    permision: [PermissionsBitField.Flags.Administrator],
    onlyOwner: true,
    onlyStaff : false,
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
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Comando eseguito con successo")
                .setColor(configs.settings.embed.color.green)
                .setDescription(`Non ci sono stati errori durante l 'esecuzione del comando
                output :\`\`\`js\n ${inspect((evaled))}  \`\`\``)
            console.log(evaled);
            interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.error(error);
            const embed = new configs.Discord.EmbedBuilder()
                .setTitle("Error")
                .setColor(configs.settings.embed.color.red)
                .setDescription("Ho riscrontrato alcuni errori!!")
                .addFields([
                    { name: 'Input:', value: `\`\`\`js\n ${args}  \`\`\`` },
                    { name: 'Error:', value: `\`\`\`js\n ${inspect((error.toString()))}  \`\`\`` },
                ])
                .setThumbnail(configs.settings.embed.images.error)
            interaction.reply({ embeds: [embed] })
        }

    }
}