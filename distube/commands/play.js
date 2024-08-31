const { CommandEmbed } = require("../../embed/distube/command");
const { ErrEmbed } = require("../../embed/err/errembed");

module.exports = {
    name: "play",
    permisions: [],
    allowedchannels: true,
    position: false,
    test: false,
    see: true,
    disTube: {
        checkchannel: true,
        checklisttrack: true
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

        try {
            const embedmsg = new CommandEmbed(interaction.guild, interaction.member);
            let songQuery = interaction.options.getString("song")
            let searchQuery = songQuery;
            let results = undefined;


            if (songQuery.includes('youtube.com') || songQuery.includes('youtu.be')) {
                if (songQuery.includes('list=')) {
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                    embedmsg.init().then(() => {
                        console.log('Ignoring YouTube playlist link');
                        interaction.reply({ embeds: [embedmsg.playlistError()], ephemeral: true });
                    }).catch((err) => {
                        console.log(err);
                    });
                    return;
                }

                const urlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
                const match = songQuery.match(urlPattern);
                if (match) {
                    searchQuery = match[1];
                }

            } else if (songQuery.includes('spotify.com')) {
                const trackRegex = /(?:https?:\/\/)?(?:www\.)?open\.spotify\.com\/track\/([a-zA-Z0-9]{22})/;


                let match = songQuery.match(trackRegex);

                if (match) {
                    results = spotifyApi.getTrack(match[1]);
                } else {
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                    embedmsg.init().then(() => {
                        console.log('Ignoring spotify playlist link');
                        interaction.reply({ embeds: [embedmsg.playlistError()], ephemeral: true });
                    }).catch((err) => {
                        console.log(err);
                    });
                    return;
                }



            }



            //TODO: Add more checks for other platforms



            embedmsg.init()
                .then(async () => {
                    distube.play(channels[0] || channels[1], songQuery, {
                        member: interaction.member,
                        textChannel: interaction.channel,
                        message: songQuery.name
                    })

                    interaction.reply({
                        embeds: [embedmsg.play(results[0])]
                    });
                })

        } catch (error) {
            const embedmsg = new ErrEmbed(interaction.guild, interaction.member);
            console.error('Error playing the song:', error);
            embedmsg.init()
                .then(() => {
                    interaction.reply({ embeds: [embedmsg.nottrackfoundError()], ephemeral: true })
                }
                ).catch((err) => {
                    console.log(err);
                })
        }
    }

}