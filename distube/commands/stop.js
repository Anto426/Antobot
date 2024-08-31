const { CommandEmbed } = require("../../embed/distube/command")
const { ErrEmbed } = require("../../embed/err/errembed")

module.exports = {
    name: "stop",
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
        name: "stop",
        description: "pulisci la coda",
    },
    async execute(interaction) {


        let queue = distube.getQueue(interaction)
        try {

            if (queue) {
                let embedmsg = new CommandEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    distube.stop(interaction)
                    interaction.reply({ embeds: [embedmsg.stop()] })
                }).catch((err) => { console.log(err); })
            } else {
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.listtrackError()], ephemeral: true })
                }).catch(() => { })
            }

        } catch (error) {
            console.error(error);
        }



    }
}