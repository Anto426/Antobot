
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
class Menu {
    constructor() {

    }

    createMenu(list, id, field, idUser, type, npage) {
        let row = new ActionRowBuilder();
        let row0 = new ActionRowBuilder();

        let incremento = 25 * npage;
        let listsize = list.length;
        let components = [];

        let tlist = list;

        let bup = new ButtonBuilder()
            .setCustomId(`${id}-${idUser}-${type}-${parseInt(npage) + 1}`)
            .setLabel('Pagina Successiva')
            .setEmoji('🔼')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);

        let bdown = new ButtonBuilder()
            .setCustomId(`${id}-${idUser}-${type}-${parseInt(npage) - 1}`)
            .setLabel('Pagina Precedente')
            .setEmoji('🔽')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true);

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