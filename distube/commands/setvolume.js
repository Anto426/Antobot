const { CommandEmbed } = require("../../embed/distube/command")
const { ErrEmbed } = require("../../embed/err/errembed")

module.exports = {
    name: "setvolume",
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
        name: "setvolume",
        description: "Imposta il volume",
        options: [{
            name: "volume",
            description: "volume",
            type: 4,
            required: true
        }]
    },
    async execute(interaction) {


        let queue = distube.getQueue(interaction)
        let temp = interaction.options.getInteger("volume")
        let volume = (temp < 100 ? (temp ? temp : 0) : 100)

        let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
        embedmsg.init().then(() => {
            queue.setVolume(volume).then(() => {
                interaction.reply({ embeds: [embedmsg.volume(volume)] })
            }).catch(() => {
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
                }).catch((err) => {
                    console.error(err);
                })

            })
        }).catch((err) => { console.log(err); })






    }
}