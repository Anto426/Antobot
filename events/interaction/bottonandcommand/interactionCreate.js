module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        if (!interaction.isCommand()) return

        const command = client.commands.get(interaction.commandName)
        if (!command) return
        if(command.onlyStaff){
            let permesso = false
            for(let role in configs[interaction.guild.name].role.staff){
                if(interaction.member.roles.cache.has(configs[interaction.guild.name].role.staff[role])){permesso=true}
            }
            if(permesso == false ){
                
                console.log("permesso negato")
                .setTitle("Error")
                .setDescription(` Non hai i permessi necessari`)
                .setThumbnail(configs.embed.images.error)
                .setColor(configs.embed.color.red)
            interaction.reply({ embeds: [embed], ephemeral: true })
                
                return 
                

            }else{
                console.log("permesso accordato")
            }
        }
        command.execute(interaction)
    }




}