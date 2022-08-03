const check = require("./../../../function/check/check")
const { ButtonStyle, PermissionsBitField } = require('discord.js');
module.exports = {

    name: "guildCreate",
    async execute(guild) {

        let temp = await check.dircheck(`./Database/`, guild.name)
        if (!temp) {
            let channel = await guild.channels.create({
                name: "💽setup",
            })
            let embed = new Discord.EmbedBuilder()
                .setTitle("💽Setup")
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
                .setDescription("Ciao grazie di aver scelto " + client.user.tag + " per far funzionare il bot completa questo setup")
            let row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('setup')
                    .setStyle(ButtonStyle.Danger)
                    .setLabel('Setup'),
                );
            channel.send({ embeds: [embed], components: [row] })


        }

    }
}