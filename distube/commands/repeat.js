const { comanddembed } = require("../../embed/distube/command")
const { errembed } = require("../../embed/err/errembed")
module.exports = {
    name: "repeat",
    permisions: [],
    allowedchannels: true,
    position: false,
    test: true,
    see: true,
    data: {
        name: "repeat",
        description: "ripeti la canzone",
        options: [{
            name: "mode",
            description: "mode",
            type: 3,
            required: true,
            choices: [{
                name: "off",
                value: 1
            }, {
                name: "Song",
                value: 2
            }, {
                name: "Queue",
                value: 3
            },]
        }]
    },
    async execute(interaction, channels) {

        try {
            let embedmsg = new comanddembed(interaction.guild, interaction.member)
            let errembed = embederr()
            let mode = interaction.options.getString("mode")
            let queue = distube.getQueue(interaction)


        } catch (error) {
            console.error(error);
        }



    }
}