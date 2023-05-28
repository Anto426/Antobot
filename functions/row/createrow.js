const cgame = require("./../../settings/games.json")
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
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
function createrowbanner(interaction, member) {
    const banner = new ButtonBuilder()
        .setCustomId(`banner-${interaction.member.id}-${member.id}`)
        .setLabel('Banner')
        .setStyle(ButtonStyle.Success);

    let row = new ActionRowBuilder()
        .addComponents(
            banner
        );
    return row

}
function createrowavatar(interaction, member) {
    const banner = new ButtonBuilder()
        .setCustomId(`avatar-${interaction.member.id}-${member.id}`)
        .setLabel('Avatar')
        .setStyle(ButtonStyle.Success);

    let row = new ActionRowBuilder()
        .addComponents(
            banner
        );

    return row

}

module.exports = { createrowmc, createrowbanner, createrowavatar }