const { CommandEmbed } = require("../../embed/distube/command");

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
                let songQuery = interaction.options.getString("song");

                interaction.reply("Caricamento...").catch((err) => {
                    console.error(err);
                });

                distube.play(channels[0] || channels[1], songQuery, {
                    member: interaction.member,
                    textChannel: interaction.channel,
                    message: songQuery.name
                }).then(async () => {
                    let queue = distube.getQueue(interaction);
                    let song = queue.songs[queue.songs.length - 1];
                    let embedmsg = new CommandEmbed(interaction.guild, interaction.member, song.thumbnail);
                    embedmsg.init().then(async () => {
                        interaction.editReply({
                            embeds: [embedmsg.play(song)],
                            content: ""
                        }).catch((err) => {
                            console.error(err);
                        });
                        resolve(0);
                    }).catch((err) => {
                        console.error(err);
                    });
                }).catch((err) => {
                    console.error(err);
                    reject(errorIndex.PLAY_ERROR);
                });
            } catch (error) {
                console.log(error);
                reject(errorIndex.GENERIC_ERROR);
            }
        })

    }

}