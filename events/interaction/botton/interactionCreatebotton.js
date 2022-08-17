const jsonf = require("../../../function/json/jsnonfunctions")
const check = require("../../../function/check/check")
const configs = require("../../../index")
const { InteractionType } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.type != InteractionType.ApplicationCommand) {
            if (interaction.customId == "deletechat") {
                interaction.channel.delete()

            }

            if (interaction.customId == "mc") {
                for (server in configs.settings.game.mc) {
                    let embed = new configs.Discord.EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle("Ecco il tuo server")

                    if (interaction.values[0] == server) {
                        console.log(server)
                        embed.setThumbnail(configs.settings.game.mc[server].images)
                        embed.setDescription(configs.settings.game.mc[server].server);
                        interaction.reply({ embeds: [embed] })
                        setTimeout(() => interaction.deleteReply(), 10000)

                    }
                }



            }


            if (interaction.customId.split("-").includes("help")) {

                idobject = require("../../../commands/help/help")
                let folders = []

                let commandsFolder = configs.fs.readdirSync("./commands");
                for (const folder of commandsFolder) {
                    if (folder != "help")
                        folders.push(folder)
                }

                if (idobject.interaction) {
                    if (interaction.customId.toString().split("-").includes(interaction.member.id)) {
                        folders.forEach(async x => {
                            if (interaction.values == x) {
                                let commands = new configs.Discord.Collection();
                                const commandsFiles = configs.fs.readdirSync(`./commands/${x}`);
                                for (const file of commandsFiles) {
                                    if (file.endsWith(".js")) {
                                        const command = require(`./../../../commands/${x}/${file}`);
                                        commands.set(command.name, command);
                                    } else {
                                        const commandsFiles2 = configs.fs.readdirSync(`./commands/${x}/${file}`)
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

                                const embed = new configs.Discord.EmbedBuilder()
                                    .setTitle("Help")
                                    .setThumbnail(configs.client.user.displayAvatarURL({ dynamic: true }))
                                    .setColor(configs.settings.embed.color.purple)
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

                        const embed = new configs.Discord.EmbedBuilder()
                            .setTitle("Error")
                            .setDescription("Non è il tuo questo menu!")
                            .setThumbnail(configs.settings.embed.images.error)
                            .setColor(configs.settings.embed.color.red)
                        interaction.reply({ embeds: [embed], ephemeral: true })
                    }
                } else {

                    const embed = new configs.Discord.EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Il bot è stato riavviato per favore crea un'altro menu")
                        .setThumbnail(configs.settings.embed.images.error)
                        .setColor(configs.settings.embed.color.red)
                    interaction.reply({ embeds: [embed], ephemeral: true })
                }

            }

        }
    }

}