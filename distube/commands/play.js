const { CommandEmbed } = require("../../embed/distube/command");
const { errorIndex } = require("../../function/err/errormenager");

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
            const embedmsg = new CommandEmbed(interaction.guild, interaction.member);
            let songQuery = interaction.options.getString("song");


            embedmsg.init()
                .then(async () => {

                    distube.play(channels[0] || channels[1], songQuery, {
                        member: interaction.member,
                        textChannel: interaction.channel,
                        message: songQuery.name
                    }).then(() => {
                        let queue = distube.getQueue(interaction);
                        let song = distube.getQueue(interaction).songs[queue.songs.length - 1];
                        interaction.reply({
                            embeds: [embedmsg.play(song)]
                        }).catch((err) => {
                            console.error(err);
                        })
                    }
                    ).catch((err) => {
                        console.log(err);
                        reject(errorIndex.PLAY_ERROR);
                    })
                })

        } catch (error) {
            console.log(error);
            reject(errorIndex.GENERIC_ERROR);
        }
    })
        
    }

}