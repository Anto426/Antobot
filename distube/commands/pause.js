const { CommandEmbed } = require("../../embed/distube/command");
const { ErrEmbed } = require("../../embed/err/errembed");

module.exports = {
    name: "pause",
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
        name: "pause",
        description: "metti in pausa la canzone",
    },
    async execute(interaction) {


        let queue = distube.getQueue(interaction.guildId)
        let embedmsg = new CommandEmbed(interaction.guild, interaction.member)


        embedmsg.init()
            .then(async () => {
                queue.pause().then(() => {
                    interaction.reply({ embeds: [embedmsg.repeat(mode)] })
                }).catch((err) => {
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.notpauseError()], ephemeral: true })
                    }).catch((err) => {
                        console.error(err);
                    })

                })
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