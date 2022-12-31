module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {
        /*       let owner = false, sowner = false, staff = false
               try {
                   const command = client.commands.get(interaction.commandName)
                   if(command)
                   for (let i in file = require("./../../../setting/onwer.json"))
                       if (interaction.user.id == d[file])
                           owner = true
       
                   if (interaction.user.id == interaction.guild.ownerId)
                       sowner = true
               } catch {
       
               }
       
       */

        interaction.reply(({ content: "All command has disable for now", ephemeral: true }))

    }
}
