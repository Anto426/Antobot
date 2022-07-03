const { inspect } = require(`util`)
module.exports = {
    name: "eval",
    onlyStaff: false,
    onlyOwner: true,
    data: {
        name: "eval",
        description: "Comando per eseguire del codice js",
        options: [{
            name: "comand",
            description: "comando",
            type: "STRING",
            required: true
        }]
    },
    async execute(interaction) {

        let args = interaction.options.getString("comand")

        try {
            evaled = await eval(args);
            const embed = new Discord.MessageEmbed()
                .setTitle("Comando eseguito con successo")
                .setColor(configs.embed.color.green)
                .setDescription(`Non ci sono stati errori durante l 'esecuzione del comando
                output :\`\`\`js\n ${inspect((evaled))}  \`\`\``)
            console.log(evaled);
            interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.error(error);
            const embed = new Discord.MessageEmbed()
                .setTitle("Error")
                .setColor(configs.embed.color.red)
                .setDescription("Ho riscrontrato alcuni errori!!")
                .addField("Input:", `\`\`\`js\n ${args}  \`\`\``)
                .addField("Error:", `\`\`\`js\n ${inspect((error.toString()))}  \`\`\``)
                .setThumbnail(configs.embed.images.error)
            interaction.reply({ embeds: [embed] })
        }

    }
}