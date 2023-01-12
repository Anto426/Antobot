const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const fs = require("fs")
const cembed = require("./../../setting/embed.json")
const cguild = require("./../../setting/guild.json")
module.exports = {
    name: "help",
    permisions: [],
    allowedchannels: [cguild["Anto's  Server"].channel.general.command, cguild["Anto's  Server"].channel.temp.command],
    data: {
        name: "help",
        description: "commando help"
    },
    execute(interaction) {


        let folders = []


        let commandsFolder = fs.readdirSync("./commands");
        for (const folder of commandsFolder) {
            if (folder != "help")
                folders.push(`📁 ${folder}`)
        }



        let selectmenu = new StringSelectMenuBuilder()
            .setCustomId(`help-${interaction.member.id}`)
            .setPlaceholder('Nothing selected')


        folders.forEach(f => {
            selectmenu.addOptions([{
                label: f,
                value: `${f.replace("📁 ", "")}`,

            }])

        })
        let row = new ActionRowBuilder()
            .addComponents(
                selectmenu
            );
        let embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription(`
            Usa il menu qui sotto per scegliere la categoria di comandi da vedere!
            ${folders.join("\n \n")}`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setColor(cembed.color.Purple)
        interaction.reply({ embeds: [embed], components: [row] })

    }
}