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

        return new Promise(async (resolve, reject) => {
            let queue = distube.getQueue(interaction)
            if (queue.songs.length == 1 && !queue.autoplay) {
                reject(errorIndex.REPLY_ERRORS.NOT_TRACK_SKIPABLE_ERROR)
            } else {
                let currentTrack = queue.songs[0];
                let nextTrack = await distube.skip(interaction.guild);
                let embedmsg = new CommandEmbed(interaction.guild, interaction.member, nextTrack.thumbnail)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.skip(currentTrack, nextTrack)] }).catch((err) => {
                        console.error(err);
                    });
                }).catch((err) => {
                    console.error(err);
                    reject(errorIndex.REPLY_ERRORS.NOT_SKIP_ERROR)
                })

                resolve(0);

            }
        })

    }
}