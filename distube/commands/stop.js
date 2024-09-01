const { CommandEmbed } = require("../../embed/distube/command")
const { ErrEmbed } = require("../../embed/err/errembed")

module.exports = {
    name: "stop",
    permisions: [],
    allowedchannels: true,
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


        let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
        embedmsg.init().then(() => {
            distube.stop(interaction).then(() => {
                interaction.reply({ embeds: [embedmsg.stop()] })
            }).catch(() => {
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.notstopError()], ephemeral: true })
                }).catch((err) => {
                    console.error(err);
                })
            })
        }).catch((err) => {
            console.error(err);
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
            }).catch((err) => {
                console.error(err);
            })
        })

    }
}