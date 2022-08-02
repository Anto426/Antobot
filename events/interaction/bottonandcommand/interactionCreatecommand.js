const { inspect } = require(`util`)
const { InteractionType } = require('discord.js');
module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {

        if (interaction.type == InteractionType.ApplicationCommand) {
            try {
                let owner = false
                for (let id in configs.owner) {
                    if (interaction.member.id == configs.owner[id] ) { owner = true }
                }
                try {
                    var staf = false
                    for (let role in configs[interaction.guild.name].role.staff) {
                        if (interaction.member.roles.cache.has(configs[interaction.guild.name].role.staff[role])) { staf = true }
                    }
                    for (let id in configs.owner) {
                        if (interaction.member.id == configs.owner[id]) { staf = true }
                    }
                } catch {}
                const command = client.commands.get(interaction.commandName)
                if (!command) return

                const commandsFiles = fs.readdirSync(`commands/bot`);
                for (const file of commandsFiles) {
                    const commands2 = require(`./../../../commands/bot/${file}`);
                    if (commands2.name == command.name && owner) {
                        command.execute(interaction)
                        return
                    }
                }

                if (stato) {
                    if (command.onlyStaff) {



                        if (staf || owner) {
                            let trovato = false
                            let trovato2 = false
                            console.log("permesso accordato")
                            const commandsFiles = fs.readdirSync(`./commands/moderation/moderation/`);
                            for (const file of commandsFiles) {
                                var commands2 = require(`./../../../commands/moderation/moderation/${file}`);
                                if (commands2.name == command.name && command.name != "unban") {
                                    trovato = true
                                    if (interaction.member.roles.highest.position > interaction.options.getMember("user").roles.highest.position) {
                                        trovato2 = true
                                        command.execute(interaction)
                                    }
                                }
                            }

                            if (!trovato) {
                                command.execute(interaction)
                            }

                            if (!trovato2) {
                                const embed = new Discord.EmbedBuilder()
                                    .setTitle("Error")
                                    .setDescription(` Hai un ruolo uguale o minore a ${interaction.options.getMember("user")}`)
                                    .setThumbnail(configs.embed.images.accesdenied)
                                    .setColor(configs.embed.color.red)
                                interaction.reply({ embeds: [embed], ephemeral: true })
                            }

                            return

                        } else {

                            console.log("permesso negato")
                            const embed = new Discord.EmbedBuilder()
                                .setTitle("Error")
                                .setDescription(` Non hai i permessi necessari`)
                                .setThumbnail(configs.embed.images.accesdenied)
                                .setColor(configs.embed.color.red)
                            interaction.reply({ embeds: [embed], ephemeral: true })

                            return
                        }
                    }

                    if (command.onlyOwner) {

                        if (owner) {

                            console.log("permesso accordato")
                            command.execute(interaction)
                            return

                        } else {

                            console.log("permesso negato")
                            const embed = new Discord.EmbedBuilder()
                                .setTitle("Error")
                                .setDescription(` Non hai i permessi necessari`)
                                .setThumbnail(configs.embed.images.accesdenied)
                                .setColor(configs.embed.color.red)
                            interaction.reply({ embeds: [embed], ephemeral: true })

                            return
                        }



                    }
                }
                const commandsFiles2 = fs.readdirSync(`./commands/privaroom/`);
                for (const file of commandsFiles2) {
                    const commands2 = require(`./../../../commands/privaroom/${file}`);
                    if (commands2.name == command.name) {
                        if (interaction.channel.name == interaction.member.user.tag || interaction.channel.topic == interaction.member.user.tag) {
                            command.execute(interaction)
                            return
                        }
                    }

                    if (interaction.channel.name == "「💻」comandi" || owner) {
                        command.execute(interaction)
                        return
                    } else {
                        console.log("permesso negato")
                        const embed = new Discord.EmbedBuilder()
                            .setTitle("Error")
                            .setDescription(`Non hai i permessi necessari  per eseguire i comandi qui !`)
                            .setThumbnail(configs.embed.images.accesdenied)
                            .setColor(configs.embed.color.red)
                        interaction.reply({ embeds: [embed], ephemeral: true })
                        return
                    }


                }


            } catch (err) {
                console.log(err)
                const embed = new Discord.EmbedBuilder()
                    .setTitle("Error")
                    .setDescription(`Qualcosa è andato storto`)
                    .setThumbnail(configs.embed.images.error)
                    .setColor(configs.embed.color.red)
                    .addFields([
                        { name: 'Error:', value: `\`\`\`\n ${inspect((err.toString()))}  \`\`\`` },
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
    }

}