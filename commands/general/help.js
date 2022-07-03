module.exports = {
    name: "help",
    onlyStaff: false,
    onlyOwner: false,
    data: {
        name: "help",
        description: "info sui comandi",
    },
    execute(interaction) {
        let folders = []


        let commandsFolder = fs.readdirSync("./commands");
        for (const folder of commandsFolder) {
            folders.push(`-${folder}`)
        }



        let selectmenu = new Discord.MessageSelectMenu()
            .setCustomId('help')
            .setPlaceholder('Nothing selected')


        folders.forEach(f => {
            selectmenu.addOptions([{
                label: f,
                value: `${f.replace("-","")}`,

            }])

        })
        const row = new Discord.MessageActionRow()
            .addComponents(
                selectmenu
            );
        const embed = new Discord.MessageEmbed()
            .setTitle("Help")
            .setDescription(`
            Usa il menu qui sotto per scegliere la categoria di comandi da vedere!

            ${folders.join("\n \n")}`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        interaction.reply({ embeds: [embed], components: [row] })

        let iduser = interaction.member.id

        module.exports = {
            iduser: iduser,
            interaction: interaction
        }
    }
}