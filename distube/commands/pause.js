const { CommandEmbed } = require("../../embed/distube/command");
const { errorIndex } = require("../../function/err/errormenager");

module.exports = {
    name: "pause",
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
        name: "pause",
        description: "metti in pausa la canzone",
    },
    async execute(interaction) {
        return new Promise((resolve, reject) => {
            let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
            embedmsg.init()
                .then(async () => {
                    distube.pause(interaction.guild)
                const queue = distube.getQueue(interaction.guild);
                    const currentTrack = queue.songs[0];
                    interaction.reply({ embeds: [embedmsg.pause(currentTrack)] }).catch((err) => {
                        console.error(err);
                    })
                    resolve(0);
                }).catch((err) => {
                    console.error(err);
                    reject(errorIndex.GENERIC_ERROR);
                });
        })
    }

}