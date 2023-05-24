const { EmbedBuilder } = require('discord.js')
const { inspect } = require(`util`)
const cembed = require("./../../setting/embed.json")
module.exports = {
    name: "eval",
    permisions: [],
    allowedchannels: global.AllowCommands,
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
            const embed = new EmbedBuilder()
                .setTitle("Comando eseguito con successo")
                .setColor(cembed.color['Green Blue'])
                .setDescription(`Non ci sono stati errori durante l 'esecuzione del comando
                output :\`\`\`js\n ${inspect((evaled))}  \`\`\``)
            interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.error(error.toString());
            const embed = new EmbedBuilder()
                .setTitle("Error")
                .setColor(cembed.color.Red)
                .setDescription("Ho riscrontrato alcuni errori!!")
                .addFields([
                    { name: 'Input:', value: `\`\`\`js\n ${args}  \`\`\`` },
                    { name: 'Error:', value: `\`\`\`js\n ${inspect((error.toString()))}  \`\`\`` },
                ])
                .setThumbnail(cembed.immage.err)
            interaction.reply({ embeds: [embed] })
        }

    }
}