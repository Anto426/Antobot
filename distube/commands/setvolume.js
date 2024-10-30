const { CommandEmbed } = require("../../embed/distube/command")
const { ErrEmbed } = require("../../embed/err/errembed")
const { errorIndex } = require("../../function/err/errormenager")

module.exports = {
    name: "setvolume",
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
        name: "setvolume",
        description: "Imposta il volume",
        options: [{
            name: "volume",
            description: "volume",
            type: 4,
            required: true
        }]
    },
    async execute(interaction) {
        
        return new Promise((resolve, reject) => {

            let queue = distube.getQueue(interaction)
            let temp = interaction.options.getInteger("volume")
            let volume = (temp < 100 ? (temp ? temp : 0) : 100)
            let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                queue.setVolume(volume)
                interaction.reply({ embeds: [embedmsg.volume(volume)] }).catch((err) => {
                    console.error(err);
                })
                resolve(0);
            }).catch((err) => {
                console.error(err);
                reject(errorIndex.NOT_VOLUME_ERROR)
            })
        })

    }
}