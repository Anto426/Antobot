
const { servermcembeddef } = require("../../../embeds/commands/general/servermcembed");
const { genericerr } = require("../../../embeds/err/generic");
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
                    servermcembeddef(interaction, row)
                }

            }

        } catch (err) { genericerr(interaction, err) }
    }
}

