 module.exports = {
     name: "clear",
     onlyStaff: true,
     onlyOwner: false,
     data: {
         name: "clear",
         description: "cancella messagi",
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
         interaction.channel.bulkDelete(count).catch(err => {
             let embed = new Discord.MessageEmbed()
                 .setColor(configs.embed.images.color.red)
                 .setTitle('Error')
                 .setDescription('Non puoi cancellare i messagi più vecchi di 14 d')
             return interaction.reply({ embeds: [embed] })
         })
         let embed = new Discord.MessageEmbed()
             .setColor(configs.embed.color.green)
             .setTitle('Messagi cancellati')
             .setDescription('Messagi cancellati')
             .addField("Numero", `\`\`\`js\n ${count}\`\`\``, true)
         interaction.reply({ embeds: [embed] })
         interaction.deleteReply()
     }

 }