const { EmbedBuilder, Collection } = require('discord.js');
const fs = require("fs")
const cembed = require("./../../../setting/embed.json")
const cgame = require("./../../../setting/game.json")

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        if (interaction.isChatInputCommand()) return;


        if (interaction.customId.split("-").includes("mc")) {

            if (interaction.customId.toString().split("-").includes(interaction.member.id)) {

                let embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle("Ecco il tuo server")
                    .setThumbnail(cgame.mc.server[interaction.values[0]].image)
                    .setDescription(cgame.mc.server[interaction.values[0]].ip);
                interaction.update({ embeds: [embed] })

            }

        } else {

            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Non è il tuo questo menu!")
                .setThumbnail(cembed.immage.err)
                .setColor(cembed.color['Red Beech'])
            interaction.reply({ embeds: [embed], ephemeral: true })
        }



        if (interaction.customId.split("-").includes("help")) {

            let folders = []

            let commandsFolder = fs.readdirSync("./commands");
            for (const folder of commandsFolder) {
                if (folder != "help")
                    folders.push(folder)
            }


            if (interaction.customId.toString().split("-").includes(interaction.member.id)) {
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
/${x.data.name}
${x.data.description}
                                    `)
                        })

                        let embed = new EmbedBuilder()
                            .setTitle("Help")
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setColor(cembed.color.Purple)
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

                let embed = new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("Non è il tuo questo menu!")
                    .setThumbnail(cembed.immage.err)
                    .setColor(cembed.color['Red Beech'])
                interaction.reply({ embeds: [embed], ephemeral: true })
            }


        }


    }


}
