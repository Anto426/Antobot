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
            let song = interaction.options.getString("song")
            const results = await distube.search(song, { limit: 5 })
            embedmsg.init()
                .then(async () => {
                    distube.play(channels[0] || channels[1], song, {
                        member: interaction.member,
                        textChannel: interaction.channel,
                        message: song.name
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