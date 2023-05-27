const { servermcembed } = require("../../../embeds/commands/general/general");
const { Cautor } = require("../../../functions/interaction/checkautorinteraction");
const { createrowmc } = require("../../../functions/row/createrow");
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;
            if (interaction.customId.split("-").includes("mc")) {

                if (Cautor(interaction)) {
                    let server = []
                    let row = createrowmc(interaction, server)
                    servermcembed(interaction, row)
                }

            }

        } catch (err) { console.log(err) }
    }
}

