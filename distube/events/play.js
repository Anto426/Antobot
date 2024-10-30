const { EventEmbed } = require("../../embed/distube/events");
module.exports = {
    name: "Play",
    typeEvent: "playSong",
    allowevents: true,
    async execute(queue, song) {
        const embedmsg = new EventEmbed(queue.textChannel.guild);
        embedmsg.init().then(() => {
            queue.textChannel.send({ embeds: [embedmsg.trackStart(queue, song)] })
        }).catch((err) => {
            console.log(err);
        });
    }
}

