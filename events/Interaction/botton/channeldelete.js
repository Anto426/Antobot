module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;

            if (interaction.customId.split("-").includes("channeldelete")) {

                interaction.channel.delete()

            }
        } catch (err) { console.log(err) }
    }
}
