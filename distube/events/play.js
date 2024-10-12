const { EventEmbed } = require("../../embed/distube/events");
const { ErrEmbed } = require("../../embed/err/errembed");

module.exports = {
    name: "Play",
    typeEvent: "playSong",
    allowevents: true,
    async execute(queue, song) {
        const embedmsg = new EventEmbed(queue.textChannel.guild);
        embedmsg.init().then(() => {
            queue.textChannel.send({ embeds: [embedmsg.trackStart(queue, song)] })
        }).catch((err) => {
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
            console.log(err);
        });
    }
}

