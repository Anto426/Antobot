const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js")
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
const cgame = require("./../../setting/game.json")

module.exports = {
    name: "servermc",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    position: false,
    test: false,
    data: {
        name: "servermc",
        description: "server di minecraft"
    },
    execute(interaction) {

        let server = []

        let selectmenu = new StringSelectMenuBuilder()
            .setCustomId(`mc-${interaction.member.id}`)
            .setPlaceholder('Nothing selected')


        for (let temp in cgame.mc.server) {
            server.push(`${cgame.mc.server[temp].emoji} ${temp}`)
            selectmenu.addOptions([{
                label: `${cgame.mc.server[temp].emoji} ${temp}`,
                value: temp,

            }])
        }

        let row = new ActionRowBuilder()
            .addComponents(
                selectmenu
            );
        let embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription(`
            Usa il menu qui sotto per ottenere ip dei server di minecraft
            ${server.join("\n \n")}`)
            .setThumbnail(cgame.mc.image)
            .setColor(cembed.color.Purple)
        interaction.reply({ embeds: [embed], components: [row] })
    }
}