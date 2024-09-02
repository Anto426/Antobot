
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
class Menu {
    constructor() {

    }

    createMenu(list, id, field, idUser, npage) {

        let row = new ActionRowBuilder();
        let row0 = new ActionRowBuilder();

        let incremento = 25 * npage;
        let components = [];

        let tlist = list;

        let bup = new ButtonBuilder()
            .setCustomId(`${id}-${idUser}-up-0`)
            .setLabel('Avanti')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);

        let bdown = new ButtonBuilder()
            .setCustomId(`${id}-${idUser}-down-0`)
            .setLabel('Indietro')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);


        if (list.length >= 25) {

            tlist = list.slice(0 + incremento, 25 + incremento);
            if ((list.length / 25) < npage) {
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
        row0.addComponents(bup, bdown);

        components.push(row, row0);

        return components;
    }



}


module.exports = { Menu };