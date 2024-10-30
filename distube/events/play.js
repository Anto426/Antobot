const { EventEmbed } = require("../../embed/distube/events");
const { DynamicColor } = require("../../function/Color/DynamicColor");
module.exports = {
    name: "Play",
    typeEvent: "playSong",
    allowevents: true,
    async execute(queue, song) {
        const embedmsg = new EventEmbed(queue.textChannel.guild);
        let dynamiccolor = new DynamicColor();
        await dynamiccolor.setImgUrl(song.thumbnail).catch((err) => { console.error(err) });
        dynamiccolor.setNumcolorextract(2);
        dynamiccolor.setThreshold(50);

        embedmsg.init().then(() => {
            dynamiccolor.ExtractPalet().then((pallet) => {
                queue.textChannel.send({ embeds: [embedmsg.trackStart(queue, song, dynamiccolor.ColorFunctions.rgbToHex(pallet[0][0], pallet[0][1], pallet[0][2]))] })
            }).catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}

