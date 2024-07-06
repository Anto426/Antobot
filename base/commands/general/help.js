const { comandbembed } = require("../../../embed/base/command");
const { menu } = require("../../../function/row/menu");
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
        let Cmenu = new menu()
        let list = []

        let comandlist = new StringSelectMenuBuilder()
            .setCustomId(`help-${interaction.member.id}`)
            .setPlaceholder('Scegli un comando')

        client.comamndg.forEach(command => {
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
                components: Cmenu.createmenu(list, "helpm", comandlist, interaction.member.id, 0),
            });
        })


    }
}