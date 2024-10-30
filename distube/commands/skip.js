const { CommandEmbed } = require("../../embed/distube/command")
const { ErrEmbed } = require("../../embed/err/errembed")
const { errorIndex } = require("../../function/err/errormenager")

module.exports = {
    name: "skip",
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
        name: "skip",
        description: "skippa la canzone attuale",
    },
    async execute(interaction) {

        return new Promise((resolve, reject) => {
            let queue = distube.getQueue(interaction)
            if (queue.songs.length == 1) {
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    reject(errorIndex.NOT_TRACK_SKIPABLE_ERROR)
                }).catch(() => {
                    console.error(err);
                })
            } else {
                let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    distube.skip(interaction)
                    interaction.reply({ embeds: [embedmsg.skip()] }).catch((err) => {
                        console.error(err);
                    })
                    resolve(0);
                }).catch((err) => {
                    console.error(err);
                    reject(errorIndex.NOT_SKIP_ERROR)
                })
            }
        })

    }
}