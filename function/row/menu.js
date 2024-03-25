const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
class menu {
    constructor() {

    }

    createmenu(list, id, fild, iduser, npage) {

        let row = new ActionRowBuilder()
        let row0 = new ActionRowBuilder()

        let incremento = 25 * npage
        let components = []


        let bup = new ButtonBuilder()
            .setCustomId(`${id}-${iduser}-up-0`)
            .setLabel('Avanti')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)

        let bdown = new ButtonBuilder()
            .setCustomId(`${id}-${iduser}-down-0`)
            .setLabel('Indietro')
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)



        if (list.size >= 25) {

            list = list.slice(0 + incremento, 25 + incremento);
            if ((list.size / 25) < npage) {
                bup.setDisabled(false)
            }
            if (npage != 0) {
                bdown.setDisabled(false)
            }
        }

        list.forEach(element => {
            menu.addOptions(element)
        });

        row.addComponents(fild)
        row0.addComponents(bup, bdown)

        components.push(row, row0)

        return components
    }



}


module.exports = { menu }