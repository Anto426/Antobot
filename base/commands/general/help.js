const { comandbembed } = require("../../../embed/base/command");
const { Menu } = require("../../../function/row/Menu");
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
module.exports = {
    name: "help",
    permisions: [],
    allowedchannels: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: false,
    data: {
        name: "help",
        description: "/help"
    },
    execute(interaction) {

        let embed = new comandbembed(interaction.guild, interaction.member)
        let CMenu = new Menu()
        let list = []

        let comandlist = new StringSelectMenuBuilder()
            .setCustomId(`help-${interaction.member.id}`)
            .setPlaceholder('Scegli un comando')

        client.commandg.forEach(command => {
            if (command.see) {
                list.push(new StringSelectMenuOptionBuilder()
                    .setLabel(`⚙️ ${command.data.name}`)
                    .setDescription(`${command.data.description}`)
                    .setValue(`${command.data.name}`))
            }

        });

        embed.init().then(() => {
            interaction.reply({
                embeds: [embed.help()],
                components: CMenu.createMenu(list, "helpm", comandlist, interaction.member.id, 0),
            });
        })


    }
}