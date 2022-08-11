const { InteractionType } = require('discord.js');
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {

            if (interaction.customId == "setup") {
                const embed = new Discord.EmbedBuilder()
                    .setTitle("Set role")
                    .setDescription("Pinga i ruoli che faranno parte dello staff")
                    .setThumbnail(configs.embed.images.load)
                    .setColor(configs.embed.color.green)

                interaction.channel.send({ embeds: [embed] })


                let filter = (message) => {
                    let embed = new Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Impossibile verificare i ruoli controlla di aver pingato dei ruoli")
                        .setColor(configs.embed.color.red)
                        .setThumbnail(configs.embed.images.error)
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
}