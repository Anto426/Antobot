const { bannerembed, avatarembed } = require("../../../embeds/commands/general/general");
const { Cautor } = require('../../../functions/interaction/checkautorinteraction');
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;

            if (interaction.customId.split("-").includes("banner")) {

                if (Cautor(interaction)) {
                    let member = interaction.guild.members.cache.find(x => x.id == interaction.customId.split("-")[2])

                    bannerembed(interaction, member)
                }

            }
            if (interaction.customId.split("-").includes("avatar")) {

                if (Cautor(interaction)) {
                    let member = interaction.guild.members.cache.find(x => x.id == interaction.customId.split("-")[2])
                    avatarembed(interaction, member)
                }

            }
        } catch (err) { console.log(err) }
    }
}
