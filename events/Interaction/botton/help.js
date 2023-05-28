const { EmbedBuilder, Collection } = require('discord.js');
const fs = require("fs")
const cembed = require("./../../../settings/embed.json")
const cgame = require("./../../../settings/games.json");
const { Cautor } = require('../../../functions/interaction/checkautorinteraction');

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        try {
            if (interaction.isChatInputCommand()) return;

            if (interaction.customId.split("-").includes("help")) {

                let folders = []

                let commandsFolder = fs.readdirSync("./commands");
                for (const folder of commandsFolder) {
                    if (folder != "help")
                        folders.push(folder)
                }


                if (Cautor(interaction)) {
                    folders.forEach(async x => {
                        if (interaction.values == x) {
                            let commands = new Collection();
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
:inbox_tray: NAME: \`\`\`${x.data.name.toString().toUpperCase()}\`\`\`
:mag_right:  DESCRIZIONE:  \`\`\`${x.data.description.toString().toUpperCase()}\`\`\`
                                        `)
                            })

                            let embed = new EmbedBuilder()
                                .setTitle("Help")
                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                .setColor(cembed.color.viola)
                                .setDescription(`
Usa il menu qui sotto per scegliere la categoria di comandi da vedere!
📁 ${interaction.values.toString().toUpperCase()}

${msg.join(" ").toString()}
                                              `)
                            interaction.update({ embeds: [embed] })

                        }
                    })
                }


            }


        } catch { }

    }
}