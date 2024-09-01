const { RepeatMode } = require("distube")
const { CommandEmbed } = require("../../embed/distube/command")
const { ErrEmbed } = require("../../embed/err/errembed")

module.exports = {
    name: "repeat",
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
        name: "repeat",
        description: "ripeti la canzone",
        options: [{
            name: "mode",
            description: "mode",
            type: 3,
            required: true,
            choices: [{
                name: "🔴Off",
                value: "0"
            }, {
                name: "🎶 Song",
                value: "1"
            }, {
                name: "🔁 Queue",
                value: "2"
            },]
        }]
    },
    async execute(interaction) {



        let queue = distube.getQueue(interaction)
        let mode = interaction.options.getString("mode")


        let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
        embedmsg.init().then(() => {
            queue.setRepeatMode(parseInt(mode))
            interaction.reply({ embeds: [embedmsg.repeat(mode)] })
        }).catch((err) => {
            console.error(err);
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.notrepeatError()], ephemeral: true })
            }).catch((err) => {
                console.error(err);
            })
        })






    }
}