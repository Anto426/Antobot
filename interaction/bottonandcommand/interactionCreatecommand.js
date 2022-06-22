module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        if (interaction.isCommand()){

        const command = client.commands.get(interaction.commandName)
        if (!command) return
        if(command.onlyStaff){
            let permesso = false
            for(let role in configs[interaction.guild.name].role.staff){
                if(interaction.member.roles.cache.has(configs[interaction.guild.name].role.staff[role])){permesso=true}
            }
            for(let id in configs.owner){
                if(interaction.member.id ==configs.owner[id]){permesso=true}
            }
            if(permesso == false ){
                
                console.log("permesso negato")
                const embed = new Discord.MessageEmbed()
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

        if(command.onlyOwner){
            let permesso = false
            for(let id in configs.owner){
                if(interaction.member.id ==configs.owner[id]){permesso=true}
            }
            if(permesso == false ){
                
                console.log("permesso negato")
                const embed = new Discord.MessageEmbed()
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




}