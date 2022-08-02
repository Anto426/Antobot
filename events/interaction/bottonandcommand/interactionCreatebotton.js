const { InteractionType } = require('discord.js');
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {
            if (interaction.customId == "deletechat") {
                interaction.channel.delete()

            }

            if (interaction.customId == "mc") {
                for (server in configs.game.mc) {
                    let embed = new Discord.EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle("Ecco il tuo server")

                    if (interaction.values[0] == server) {
                        console.log(server)
                        embed.setThumbnail(configs.game.mc[server].images)
                        embed.setDescription(configs.game.mc[server].server);
                        interaction.reply({ embeds: [embed] })
                        setTimeout(() => interaction.deleteReply(), 10000)

                    }
                }



            }


            if (interaction.customId.split("-").includes("help")) {

                idobject = require("./../../../commands/help/help")
                let folders = []

                let commandsFolder = fs.readdirSync("./commands");
                for (const folder of commandsFolder) {
                    if (folder != "help")
                        folders.push(folder)
                }

                if (idobject.interaction) {
                    if (interaction.customId.toString().split("-").includes(interaction.member.id)) {
                        folders.forEach(async x => {
                            if (interaction.values == x) {
                                let commands = new Discord.Collection();
                                const commandsFiles = fs.readdirSync(`./commands/${x}`);
                                for (const file of commandsFiles) {
                                    if (file.endsWith(".js")) {
                                        const command = require(`./../../../commands/${x}/${file}`);
                                        commands.set(command.name, command);
                                    } else {
                                        const commandsFiles2 = fs.readdirSync(`./commands/${x}/${file}`)
                                        for (const file2 of commandsFiles2) {
                                            const command = require(`./../../../commands/${x}/${file}/${file2}`);
                                            commands.set(command.name, command);
                                        }
                                    }
                                }
                                let msg = []
                                commands.forEach(x => {
                                    msg.push(`
/${x.data.name}
${x.data.description}
                                    `)
                                })

                                const embed = new Discord.EmbedBuilder()
                                    .setTitle("Help")
                                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                    .setColor(configs.embed.color.purple)
                                    .setDescription(`
Usa il menu qui sotto per scegliere la categoria di comandi da vedere!

📁 ${interaction.values.toString().toUpperCase()}
\`\`\`
${msg.join(" ").toString()}
                 \`\`\`


                                     `)
                                interaction.update({ embeds: [embed] })

                            }
                        })
                    } else {

                        const embed = new Discord.EmbedBuilder()
                            .setTitle("Error")
                            .setDescription("Non è il tuo questo menu!")
                            .setThumbnail(configs.embed.images.error)
                            .setColor(configs.embed.color.red)
                        interaction.reply({ embeds: [embed], ephemeral: true })
                    }
                } else {

                    const embed = new Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Il bot è stato riavviato per favore crea un'altro menu")
                        .setThumbnail(configs.embed.images.error)
                        .setColor(configs.embed.color.red)
                    interaction.reply({ embeds: [embed], ephemeral: true })
                }

            }

        }
    }

}