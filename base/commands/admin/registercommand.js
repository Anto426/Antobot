const { comandbembed } = require("../../../embed/base/command")
const { ErrEmbed } = require("../../../embed/err/errembed")
const { WriteCommand } = require("../../../function/commands/WriteCommand")
const { BotConsole } = require("../../../function/log/botConsole")
const setting = require("../../../setting/settings.json")

module.exports = {
    name: "registercommand",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: true,
    position: false,
    test: true,
    see: true,
    data: {
        name: "registercommand",
        description: "Registra i comandi in tutte le gilde",
    },

    async execute(interaction) {

        let embedmsg = new comandbembed(interaction.guild, interaction.member)
        let reg = new WriteCommand()
        embedmsg.init().then(async () => {

            interaction.reply({ embeds: [embedmsg.registerCommand(0)] })

            reg.commandallguild().then(() => {
                interaction.editReply({ embeds: [embedmsg.registerCommand(1)] })

            }).catch(() => {

                reg.commandallguild().then(() => {
                    interaction.editReply({ embeds: [embedmsg.registerCommand(-1)] })

                })

            })

        })
    }

}
