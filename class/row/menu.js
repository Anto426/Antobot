import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

class Menu {
  createMenu(list, id, field, idUser, type, npage) {
    const row = new ActionRowBuilder();
    const row0 = new ActionRowBuilder();

    const pageSize = 25;
    const offset = pageSize * npage;
    const listsize = list.length;
    const components = [];

    let tlist = list;

    const bup = new ButtonBuilder()
      .setCustomId(`${id}-${idUser}-${type}-${parseInt(npage) + 1}`)
      .setLabel("Pagina Successiva")
      .setEmoji("🔼")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true);

    const bdown = new ButtonBuilder()
      .setCustomId(`${id}-${idUser}-${type}-${parseInt(npage) - 1}`)
      .setLabel("Pagina Precedente")
      .setEmoji("🔽")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true);

    if (listsize >= pageSize) {
      tlist = list.slice(offset, offset + pageSize);
      if (Math.floor(listsize / pageSize) > npage) {
        bup.setDisabled(false);
      }
      if (npage !== 0) {
        bdown.setDisabled(false);
      }
    }

    tlist.forEach((element) => field.addOptions(element));

    row.addComponents(field);
    row0.addComponents(bdown, bup);

    components.push(row, row0);

    return components;
  }
}

export default Menu;
