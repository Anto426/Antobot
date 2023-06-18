const { updaterowdisablebooton } = require("../row/createrow");

async function disablebotton(interaction) {

    let originalRow = interaction.message.components.find(component => component.type === 1);
    let newRow = updaterowdisablebooton(originalRow)
    interaction.message.edit({ components: [newRow] })

}
module.exports = {
    disablebotton
}