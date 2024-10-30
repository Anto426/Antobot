const { EventEmbed } = require("../../embed/distube/events");
const { ErrEmbed } = require("../../embed/err/errembed");

module.exports = {
    name: "Error of distube",
    typeEvent: "error",
    allowevents: true,
    async execute(error, queue, song) {
        console.log(error);
        let embedmsg = new EventEmbed(queue.textChannel.guild);
        embedmsg.init().then(() => {
            queue.textChannel.send({ embeds: [embedmsg.error(song)], ephemeral: true });
        }).catch((err) => {
            console.error(err);
        });
    }
}

