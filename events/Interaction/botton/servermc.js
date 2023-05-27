const { serverinfoembed } = require("../../../embeds/commands/general/general");
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;
        
            if (interaction.customId.split("-").includes("mc")) {

                if (Cautor(interaction)) {

                    serverinfoembed(interaction)

                }

            }

        } catch { }
    }
}

