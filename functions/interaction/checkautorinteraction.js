const { notyourbootn } = require("../../embeds/err/error")

function Cautor(interaction) {
    try {
        if (interaction.customId.toString().split("-").includes(interaction.member.id)) {
            return true
        } else {
            notyourbootn(interaction)
            return false
        }
    } catch { return false }
}

module.exports = { Cautor }