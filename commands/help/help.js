const configs = require("./../../index")
module.exports = {
    name: "help",
    permision: [],
    onlyOwner: false,
    onlyStaff : false,
    data: {
        name: "help",
        description: "Info sui comandi"
    },
    execute(interaction) {


        let folders = []


        let commandsFolder = configs.fs.readdirSync("./commands");
        for (const folder of commandsFolder) {
            if (folder != "help")
                folders.push(`📁 ${folder}`)
        }



        let selectmenu = new configs.Discord.SelectMenuBuilder()
            .setCustomId(`help-${interaction.member.id}`)
            .setPlaceholder('Nothing selected')


        folders.forEach(f => {
            selectmenu.addOptions([{
                label: f,
                value: `${f.replace("📁 ","")}`,

            }])

        })
        const row = new configs.Discord.ActionRowBuilder()
            .addComponents(
                selectmenu
            );
        const embed = new configs.Discord.EmbedBuilder()
            .setTitle("Help")
            .setDescription(`
            Usa il menu qui sotto per scegliere la categoria di comandi da vedere!

            ${folders.join("\n \n")}`)
            .setThumbnail(configs.client.user.displayAvatarURL({ dynamic: true }))
            .setColor(configs.settings.embed.color.purple)
        interaction.reply({ embeds: [embed], components: [row] })

        let iduser = interaction.member.id

        const configs = require("./../../index")
module.exports = {
            iduser: iduser,
            interaction: interaction,
        }
    }
}