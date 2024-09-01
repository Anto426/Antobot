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

        try {
            const embedmsg = new CommandEmbed(interaction.guild, interaction.member);
            let songQuery = interaction.options.getString("song");


            embedmsg.init()
                .then(async () => {

                    distube.play(channels[0] || channels[1], songQuery, {
                        member: interaction.member,
                        textChannel: interaction.channel,
                        message: songQuery.name
                    })
                    
                    interaction.reply({
                        embeds: [embedmsg.play()]
                    }).catch((err) => {
                        console.error(err);
                    })


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