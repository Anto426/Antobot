const { inspect } = require(`util`)
const { InteractionType } = require('discord.js');
const configs = require("./../../../index")
module.exports = {
    name: "interactionCreate-commands",
    async execute(interaction) {

        if (interaction.type == InteractionType.ApplicationCommand) {
            try {
                let owner = false
                for (let id in configs.owner) {
                    if (interaction.member.id == configs.owner[id]) { owner = true }
                }
                let sowner = false
                if (interaction.member.id == interaction.guild.ownerId) { sowner = true }

                try {
                    var staf = false
                    for (let role in configs[interaction.guild.name].role.staff) {
                        if (interaction.member.roles.cache.has(configs[interaction.guild.name].role.staff[role])) { staf = true }
                    }
                    for (let id in configs.owner) {
                        if (interaction.member.id == configs.owner[id]) { staf = true }
                    }
                } catch { }
                const command = configs.client.commands.get(interaction.commandName)
                if (!command) return

                const commandsFiles = configs.fs.readdirSync(`commands/bot`);
                for (const file of commandsFiles) {
                    const commands2 = require(`./../../../commands/bot/${file}`);
                    if (commands2.name == command.name && owner) {
                        command.execute(interaction)
                        return
                    }
                }

                if (configs.stato) {
                    if (command.onlyStaff) {



                        if (staf || owner || sowner) {
                            let trovato = false
                            let trovato2 = false
                            console.log("permesso accordato")
                            const commandsFiles = configs.fs.readdirSync(`./commands/moderation/moderation/`);
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
                                const embed = new configs.Discord.EmbedBuilder()
                                    .setTitle("Error")
                                    .setDescription(` Hai un ruolo uguale o minore a ${interaction.options.getMember("user")}`)
                                    .setThumbnail(configs.settings.embed.images.accesdenied)
                                    .setColor(configs.settings.embed.color.red)
                                interaction.reply({ embeds: [embed], ephemeral: true })
                            }

                            return

                        } else {

                            console.log("permesso negato")
                            const embed = new configs.Discord.EmbedBuilder()
                                .setTitle("Error")
                                .setDescription(` Non hai i permessi necessari`)
                                .setThumbnail(configs.settings.embed.images.accesdenied)
                                .setColor(configs.settings.embed.color.red)
                            interaction.reply({ embeds: [embed], ephemeral: true })

                            return
                        }
                    }

                    if (command.onlyOwner) {

                        if (owner || sowner) {

                            console.log("permesso accordato")
                            command.execute(interaction)
                            return

                        } else {

                            console.log("permesso negato")
                            const embed = new configs.Discord.EmbedBuilder()
                                .setTitle("Error")
                                .setDescription(` Non hai i permessi necessari`)
                                .setThumbnail(configs.settings.embed.images.accesdenied)
                                .setColor(configs.settings.embed.color.red)
                            interaction.reply({ embeds: [embed], ephemeral: true })

                            return
                        }



                    }
                }
                const commandsFiles2 = configs.fs.readdirSync(`./commands/privaroom/`);
                for (const file of commandsFiles2) {
                    const commands2 = require(`./../../../commands/privaroom/${file}`);
                    if (commands2.name == command.name) {
                        if (interaction.channel.name == interaction.member.user.tag || interaction.channel.topic == interaction.member.user.tag) {
                            command.execute(interaction)
                            return
                        }
                    }

                    if (interaction.channel.name == "「💻」comandi" || owner || sowner) {
                        command.execute(interaction)
                        return
                    } else {
                        console.log("permesso negato")
                        const embed = new configs.Discord.EmbedBuilder()
                            .setTitle("Error")
                            .setDescription(`Non hai i permessi necessari  per eseguire i comandi qui !`)
                            .setThumbnail(configs.settings.embed.images.accesdenied)
                            .setColor(configs.settings.embed.color.red)
                        interaction.reply({ embeds: [embed], ephemeral: true })
                        return
                    }


                }


            } catch (err) {
                console.log(err)
                const embed = new configs.Discord.EmbedBuilder()
                    .setTitle("Error")
                    .setDescription(`Qualcosa è andato storto`)
                    .setThumbnail(configs.settings.embed.images.error)
                    .setColor(configs.settings.embed.color.red)
                    .addFields([
                        { name: 'Error:', value: `\`\`\`\n ${inspect((err.toString()))}  \`\`\`` },
                    ])
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
    }

}