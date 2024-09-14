
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
class Menu {
    constructor() {

    }

    createMenu(list, id, field, idUser, npage, type) {
        let row = new ActionRowBuilder();
        let row0 = new ActionRowBuilder();

        let incremento = 25 * npage;
        let listsize = list.length;
        let components = [];

        let tlist = list;

        let bup = new ButtonBuilder()
            .setCustomId(`${id}-${idUser}-${parseInt(npage) + 1}-${type}`)
            .setLabel('Avanti')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);

        let bdown = new ButtonBuilder()
            .setCustomId(`${id}-${idUser}-${parseInt(npage) - 1}-${type}`)
            .setLabel('Indietro')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);

        if (!field.customId)
            field.setCustomId(`${id}-${idUser}-${npage}-${type}`);

        if (listsize >= 25) {

            tlist = list.slice(0 + incremento, 25 + incremento);

            if (((listsize % 25) / 25) > npage) {
                bup.setDisabled(false);
            }

            if (npage != 0) {
                bdown.setDisabled(false);
            }
        }

        tlist.forEach(element => {
            field.addOptions(element);
        });

        row.addComponents(field);
        row0.addComponents(bdown, bup);

        components.push(row, row0);

        return components;
    }



}


module.exports = { Menu };