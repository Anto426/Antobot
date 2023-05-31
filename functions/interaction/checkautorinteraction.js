const { notyourbootn } = require("../../embeds/err/interaction/interaction");


function Cautor(interaction) {
    try {
        if (interaction.customId.toString().split("-").includes(interaction.member.id)) {
            return true
        } else {
            notyourbootn(interaction)
            return false
        }
    } catch (err) { console.log(err); return false }
}

module.exports = { Cautor }

