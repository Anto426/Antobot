const { CommandEmbed } = require("../../embed/distube/command")
const { ErrEmbed } = require("../../embed/err/errembed")

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


        let queue = distube.getQueue(interaction)

        if (queue.songs.length == 1) {
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.notrakskipableError()], ephemeral: true }).catch((err) => {
                    console.error(err);
                })
            }).catch(() => {
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true }).catch((err) => {
                        console.error(err);
                    })
                }).catch((err) => {
                    console.error(err);
                })
            })

        } else {
            let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                distube.skip(interaction)
                interaction.reply({ embeds: [embedmsg.skip()] }).catch((err) => {
                    console.error(err);
                })
            }).catch((err) => {
                console.log(err);
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.notskipError()], ephemeral: true }).catch((err) => {
                        console.error(err);
                    })
                }).catch((err) => {
                    console.error(err);
                })
            })

        }

    }
}