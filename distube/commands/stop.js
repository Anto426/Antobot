const { CommandEmbed } = require("../../embed/distube/command")
const { errorIndex } = require("../../function/err/errormenager")

module.exports = {
    name: "stop",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    position: false,
    test: false,
    see: true,
    disTube: {
        checkchannel: true,
        checklisttrack: true
    },
    data: {
        name: "stop",
        description: "pulisci la coda",
    },
    async execute(interaction) {

        return new Promise((resolve, reject) => {
            let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                distube.stop(interaction).then(() => {
                    interaction.reply({ embeds: [embedmsg.stop()] }).catch((err) => {
                        console.error(err);
                    })
                    resolve(0);
                }).catch(() => {
                    reject(errorIndex.NOT_STOP_ERROR)
                })
            }).catch((err) => {
                console.error(err);
            })

        })
    }
}