const { CommandEmbed } = require("../../embed/distube/command");
const { ErrEmbed } = require("../../embed/err/errembed");

module.exports = {
    name: "pause",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    position: false,
    test: false,
    see: true,
    disTube: {
        checkchannel: true,
        checklisttrack: true
    },
    data: {
        name: "pause",
        description: "metti in pausa la canzone",
    },
    async execute(interaction) {


        let embedmsg = new CommandEmbed(interaction.guild, interaction.member)


        embedmsg.init()
            .then(async () => {
                distube.pause(interaction.guild)
                interaction.reply({ embeds: [embedmsg.pause()] })

            }).catch((err) => {
                console.error(err);
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.notpauseError()], ephemeral: true });
                }).catch((err) => {
                    console.error(err);
                });
            });


    }

}