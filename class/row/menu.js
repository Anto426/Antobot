import { ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export default class Menu {
    createMenu(list, id, field, idUser, type, npage = 0) {
        const pageSize = 15;
        const pageNumber = parseInt(npage, 10);



        const startIndex = pageNumber * pageSize;
        const totalPages = list.length / pageSize
        const pageList = list.slice(startIndex, startIndex + pageSize);

        if (pageList.length > 0) {
            field.setOptions(pageList);
        } else {
            field.setPlaceholder("Nessuna opzione disponibile")
                .setDisabled(true)
                .setOptions([
                    new StringSelectMenuOptionBuilder()
                        .setLabel("N/A")
                        .setValue("placeholder_option")
                ]);
        }

        const menuRow = new ActionRowBuilder().addComponents(field);
        const components = [menuRow];

        if (totalPages > 1) {
            const prevButton = new ButtonBuilder()
                .setCustomId(`${id}-${idUser}-${type}-${pageNumber - 1}`)
                .setLabel("Pagina Precedente")
                .setEmoji("⬅️")
                .setStyle(ButtonStyle.Success)
                .setDisabled(pageNumber === 0);

            const nextButton = new ButtonBuilder()
                .setCustomId(`${id}-${idUser}-${type}-${pageNumber + 1}`)
                .setLabel("Pagina Successiva")
                .setEmoji("➡️")
                .setStyle(ButtonStyle.Success)
                .setDisabled(pageNumber >= totalPages - 1);
            
            const buttonRow = new ActionRowBuilder().addComponents(prevButton, nextButton);
            components.push(buttonRow);
        }

        return components;
    }
}