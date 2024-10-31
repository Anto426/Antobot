const { CommandEmbed } = require("../../embed/distube/command");
const { DynamicColor } = require("../../function/Color/DynamicColor");
const { errorIndex } = require("../../function/err/errormenager");

module.exports = {
    name: "play",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    position: false,
    test: false,
    see: true,
    disTube: {
        checkchannel: true,
        checklisttrack: false
    },
    data: {
        name: "play",
        description: "Aggiungi traccia alla coda",
        options: [{
            name: "song",
            description: "Link o nome della canzone",
            type: 3,
            required: true
        }]
    },
    async execute(interaction, channels) {
        return new Promise((resolve, reject) => {
            try {
                const embedmsg = new CommandEmbed(interaction.guild, interaction.member);
                let songQuery = interaction.options.getString("song");
                let dynamiccolor = new DynamicColor();
                dynamiccolor.setNumcolorextract(2);
                dynamiccolor.setThreshold(50);

                interaction.reply("Caricamento...").catch((err) => {
                    console.error(err);
                });
                embedmsg.init()
                    .then(async () => {
                        distube.play(channels[0] || channels[1], songQuery, {
                            member: interaction.member,
                            textChannel: interaction.channel,
                            message: songQuery.name
                        }).then(async () => {
                            let queue = distube.getQueue(interaction);
                            let song = queue.songs[queue.songs.length - 1];
                            await dynamiccolor.setImgUrl(song.thumbnail).catch((err) => { console.error(err) });
                            dynamiccolor.ExtractPalet().then((pallet) => {
                                interaction.editReply({
                                    embeds: [embedmsg.play(song, dynamiccolor.ColorFunctions.rgbToHex(pallet[0][0], pallet[0][1], pallet[0][2]))],
                                    content: ""
                                }).catch((err) => {
                                    console.error(err);
                                });
                            }).catch((err) => {
                                console.error(err);
                            });
                            resolve(0);
                        }).catch((err) => {
                            console.log(err);
                            reject(errorIndex.PLAY_ERROR);
                        })
                    })
            } catch (error) {
                console.log(error);
                reject(errorIndex.GENERIC_ERROR);
            }
        })

    }

}