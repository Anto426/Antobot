const { InteractionType } = require('discord.js');
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {
            let selectmenu = new Discord.SelectMenuBuilder()
                .setPlaceholder('Nothing selected')





            if (interaction.customId == "setup") {
                let embed = new Discord.EmbedBuilder()
                    .setTitle("💽Setup")
                    .setThumbnail(configs.embed.images.load)
                    .setColor(configs.embed.color.green)
                    .setDescription("Ciao per prima cosa scegli i ruoli che potranno usare i comandi da moderazione")
                selectmenu
                    .setCustomId(`role`)
                    .setMaxValues(interaction.guild.roles.cache.size)

                interaction.guild.roles.cache.forEach(x => {
                    selectmenu.addOptions([{
                        label: x.name,
                        value: x.id,

                    }])


                });
                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        selectmenu
                    );

                interaction.update({ embeds: [embed], components: [row] })
            }





        }

    }
}