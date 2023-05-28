const cgame = require("./../../settings/games.json")
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
function createrowmc(interaction, server) {
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

    return row

}

module.exports = { createrowmc }