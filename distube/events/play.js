const { EventEmbed } = require("../../embed/distube/events");
module.exports = {
    name: "Play",
    typeEvent: "playSong",
    allowevents: true,
    async execute(queue, song) {
        return new Promise((resolve, reject) => {
            const embedmsg = new EventEmbed(queue.textChannel.guild, null, song.thumbnail);
            embedmsg.init().then(() => {
                queue.textChannel.send({ embeds: [embedmsg.trackStart(queue, song)] })
            }).catch((err) => {
                console.log(err);
            });
        });

    }
}

