module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        if (!interaction.isCommand()) return

        const command = client.commands.get(interaction.commandName)
        if (!command) return
        if(command.onlyStaff){
            interaction.channel.send("hey bro")
        }
        command.execute(interaction)
    }




}