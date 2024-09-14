const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
const { Cjson } = require("../../../function/file/json");
const { Menu } = require("../../../function/row/menu");
const setting = require("../../../setting/settings.json");
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
module.exports = {
    name: "help",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
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
        let json = new Cjson()
        json.jsonDependencyBuffer(setting.configjson.online.url + "/" + setting.configjson.online.name[6], process.env.GITTOKEN).then((jsonf) => {

            let comandlist = new StringSelectMenuBuilder()
                .setPlaceholder('Scegli un comando')

            client.commandg.forEach(command => {
                if (command.see) {
                    list.push(new StringSelectMenuOptionBuilder()
                        .setLabel(`${jsonf.command[command.name] ? jsonf.command[command.name].emoji : "⚙️"} ${command.data.name}`)
                        .setDescription(`${command.data.description}`)
                        .setValue(`${command.data.name}`))
                }

            });

            embed.init().then(() => {
                interaction.reply({
                    embeds: [embed.help()],
                    components: CMenu.createMenu(list, [], "help", comandlist, interaction.member.id, 0, 0),
                });
            })
        }).catch((err) => {
            console.log(err)
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
            }
            ).catch((err) => {
                console.error(err);
            })
        })




    }
}