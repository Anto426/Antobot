const { comandbembed } = require("../../../embed/base/command")
const { errorIndex } = require("../../../function/err/errormenager");
const { WriteCommand } = require("../../../function/commands/WriteCommand")

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

        return new Promise((resolve, reject) => {
            let reg = new WriteCommand()
            let embedmsg = new comandbembed(interaction.guild, interaction.member)
            embedmsg.init().then(async () => {
                interaction.reply({ embeds: [embedmsg.registerCommand(0)], ephemeral: true }).catch((err) => {
                    console.log(err)
                })

                reg.commandallguild().then(() => {
                    interaction.editReply({ embeds: [embedmsg.registerCommand(1)], ephemeral: true }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    if (!Number.isNaN(err))
                        interaction.editReply({ embeds: [embedmsg.registerCommand(err)], ephemeral: true }).catch((err) => {
                            console.log(err)
                        })
                    else
                        console.log(err)
                })

                resolve(0)

            }).catch(() => {
                reject(errorIndex.GENERIC_ERROR)
            })


        });


    }

}
