const { CommandEmbed } = require("../../embed/distube/command")
const { errorIndex } = require("../../function/err/errormenager")

module.exports = {
    name: "repeat",
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
        name: "repeat",
        description: "ripeti la canzone",
        options: [{
            name: "mode",
            description: "mode",
            type: 4,
            required: true,
            choices: [{
                name: "🔴Off",
                value: 0
            }, {
                name: "🎶 Song",
                value: 1
            }, {
                name: "🔁 Queue",
                value: 2
            },]
        }]
    },
    async execute(interaction) {

        return new Promise((resolve, reject) => {
            let queue = distube.getQueue(interaction)
            let mode = interaction.options.getInteger("mode")
            let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                queue.setRepeatMode(mode)
                interaction.reply({ embeds: [embedmsg.repeat(mode)] }).catch((err) => {
                    console.error(err);
                })
                resolve(0);
            }).catch((err) => {
                console.error(err);
                reject(errorIndex.NOT_REPEAT_ERROR);
            })
        })


    }
}