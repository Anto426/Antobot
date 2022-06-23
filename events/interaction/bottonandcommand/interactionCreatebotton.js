module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        if (interaction.customId == "deletechat") {
            interaction.channel.delete()

        }

        if (interaction.customId == "mc") {
            for (server in configs.game.mc) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle("Ecco il tuo server")

                if (interaction.values[0] == server) {
                    console.log(server)
                    embed.setThumbnail(configs.game.mc[server].images)
                    embed.setDescription(configs.game.mc[server].server);
                    interaction.reply({ embeds: [embed] })
                    setTimeout(() => interaction.deleteReply(), 10000)

                }
            }

        }

        if (interaction.customId == "mc") {
            for (server in configs.game.mc) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle("Ecco il tuo server")

                if (interaction.values[0] == server) {
                    console.log(server)
                    embed.setThumbnail(configs.game.mc[server].images)
                    embed.setDescription(configs.game.mc[server].server);
                    interaction.reply({ embeds: [embed] })
                    setTimeout(() => interaction.deleteReply(), 10000)

                }
            }

        }
    }




}