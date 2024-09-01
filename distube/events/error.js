const { EventEmbed } = require("../../embed/distube/events");
const { ErrEmbed } = require("../../embed/err/errembed");

module.exports = {
    name: "Error of distube",
    typeEvent: "ffmpegDebug",
    async execute(error, queue, song) {
        let embedmsg = new EventEmbed(interaction.guild, interaction.member);
        console.log(error);
        embedmsg.init().then(() => {
            queue.textChannel.send({ embeds: [embedmsg.error(song)], ephemeral: true });
        }).catch((err) => {
            console.error(err);
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true });
            }).catch((err) => {
                console.error(err);
            });

        });
    }
}

