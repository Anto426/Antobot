module.exports = {
    name: "clear",
    onlyStaff: true,
    onlyOwner: false,
    data: {
        name: "clear",
        description: "Cancella I messagi",
        options: [{
            name: "nmessaggi",
            description: "numeri di mess da cancellare",
            type: "NUMBER",
            required: true
        }]
    },
    async execute(interaction) {

        var count = interaction.options.getNumber("nmessaggi")
        if (count > 100) {
            let embed = new Discord.MessageEmbed()
                .setColor(configs.embed.images.color.red)
                .setTitle('Error')
                .setDescription('Non puoi cancellare più di 100 messaggi')
            return interaction.reply({ embeds: [embed] })
        }
        const myPromise = new Promise((resolve, reject) => {
            interaction.channel.bulkDelete(count).catch((err) => { console.log(err) })
            resolve(() => {
                let embed = new Discord.MessageEmbed()
                    .setColor(configs.embed.color.green)
                    .setTitle('Messagi cancellati')
                    .setDescription('Messagi cancellati')
                    .addField("Numero", `\`\`\`js\n ${count}\`\`\``, true)
                interaction.reply({ embeds: [embed] }).then(() => {
                    interaction.deleteReply()
                })
            })

            reject(() => {
                let embed = new Discord.MessageEmbed()
                    .setColor(configs.embed.color.red)
                    .setTitle('Error')
                    .setDescription('Qualcosa è andato storto')
                    .setThumbnail(configs.embed.images.error)
                interaction.reply({ embeds: [embed] })

            })
        })




    }

}