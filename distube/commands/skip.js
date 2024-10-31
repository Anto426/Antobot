const { CommandEmbed } = require("../../embed/distube/command")
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
                reject(errorIndex.NOT_TRACK_SKIPABLE_ERROR)
            } else {
                let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    let currentTrack = queue.songs[0];
                    let nextTrack = queue.songs[1];
                    distube.skip(interaction);
                    interaction.reply({ embeds: [embedmsg.skip(currentTrack, nextTrack)] }).catch((err) => {
                        console.error(err);
                    });
                    resolve(0);
                }).catch((err) => {
                    console.error(err);
                    reject(errorIndex.NOT_SKIP_ERROR)
                })
            }
        })

    }
}