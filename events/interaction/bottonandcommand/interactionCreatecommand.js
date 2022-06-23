module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        if (interaction.isCommand()) {

            let owner = false
            for (let id in configs.owner) {
                if (interaction.member.id == configs.owner[id]) { owner = true }
            }
            let staf = false
            for (let role in configs[interaction.guild.name].role.staff) {
                if (interaction.member.roles.cache.has(configs[interaction.guild.name].role.staff[role])) { staf = true }
            }
            for (let id in configs.owner) {
                if (interaction.member.id == configs.owner[id]) { staf = true }
            }

            const command = client.commands.get(interaction.commandName)
            if (!command) return
            if (command.onlyStaff) {

                if (staf == false) {

                    console.log("permesso negato")
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription(` Non hai i permessi necessari`)
                        .setThumbnail(configs.embed.images.accesdenied)
                        .setColor(configs.embed.color.red)
                    interaction.reply({ embeds: [embed], ephemeral: true })

                    return


                } else {
                    console.log("permesso accordato")
                    command.execute(interaction)
                    return
                }
            }

            if (command.onlyOwner) {

                if (owner == false) {

                    console.log("permesso negato")
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription(` Non hai i permessi necessari`)
                        .setThumbnail(configs.embed.images.accesdenied)
                        .setColor(configs.embed.color.red)
                    interaction.reply({ embeds: [embed], ephemeral: true })

                    return


                } else {
                    console.log("permesso accordato")
                    command.execute(interaction)
                    return
                }



            }
            if (interaction.channel.name == "「💻」comandi" || owner) {
                command.execute(interaction)
                return
            } else {
                console.log("permesso negato")
                const embed = new Discord.MessageEmbed()
                    .setTitle("Error")
                    .setDescription(`Non hai i permessi necessari  per eseguire i comandi qui !`)
                    .setThumbnail(configs.embed.images.accesdenied)
                    .setColor(configs.embed.color.red)
                interaction.reply({ embeds: [embed], ephemeral: true })
                return
            }


        }


    }




}