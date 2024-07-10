const { comanddembed } = require("../../embed/distube/command")
module.exports = {
    name: "play",
    permisions: [],
    allowedchannels: true,
    position: false,
    test: true,
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
            let embedmsg = new comanddembed(interaction.guild, interaction.member)
            let song = interaction.options.getString("song")
            embedmsg.init(async () => {
                await distube.play(channels[0] || channels[1], song, {
                    member: interaction.member,
                    textChannel: interaction.channel,
                    message: song.name
                })
                interaction.reply({ embeds: [embedmsg.play()] })
            }).catch(() => { return })

        } catch (error) {
            console.error(error);
        }



    }
}