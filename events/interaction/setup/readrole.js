/*const { InteractionType } = require('configs.Discord.js');
const configs = require("./../../index")
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {

            if (interaction.customId == "setup") {
                const embed = new configs.Discord.EmbedBuilder()
                    .setTitle("Set role")
                    .setDescription("Pinga i ruoli che faranno parte dello staff")
                    .setThumbnail(configs.settings.embed.images.load)
                    .setColor(configs.settings.embed.color.green)

                interaction.channel.send({ embeds: [embed] })


                let filter = (message) => {
                    let embed = new configs.Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Impossibile configs.verificare i ruoli controlla di aver pingato dei ruoli")
                        .setColor(configs.settings.embed.color.red)
                        .setThumbnail(configs.settings.embed.images.error)
                    if (message.member.user.bot) return
                    if (message.mentions.roles.size != 0) return true;
                    else interaction.channel.send({ embeds: [embed] })
                }

                role = await interaction.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 300000,
                    errors: ["time"],
                })

                if(role){

                }






            }





        }

    }
}*/