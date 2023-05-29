const { EmbedBuilder } = require('discord.js')
const { inspect } = require(`util`)
const cembed = require("./../../settings/embed.json")
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
            evaled = await eval(args).catch(() => { });
            const embed = new EmbedBuilder()
                .setTitle("Comando eseguito con successo")
                .setColor(cembed.color.verde)
                .setDescription(`Non ci sono stati errori durante l 'esecuzione del comando
                output :\`\`\`js\n ${inspect((evaled))}  \`\`\``)
            interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.error(error.toString());
            const embed = new EmbedBuilder()
                .setTitle("Error")
                .setColor(cembed.color.rosso)
                .setDescription("Ho riscrontrato alcuni errori!!")
                .addFields([
                    { name: 'Input:', value: `\`\`\`js\n ${args}  \`\`\`` },
                    { name: 'Error:', value: `\`\`\`js\n ${inspect((error.toString()))}  \`\`\`` },
                ])
                .setThumbnail(cembed.image.error)
            interaction.reply({ embeds: [embed] })
        }

    }
}