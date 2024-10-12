const { CommandEmbed } = require("../../embed/distube/command");
const { ErrEmbed } = require("../../embed/err/errembed");

module.exports = {
    name: "resume",
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
        name: "resume",
        description: "riprende la canzone",
    },
    async execute(interaction) {


        let embedmsg = new CommandEmbed(interaction.guild, interaction.member)

        embedmsg.init()
            .then(async () => {
                distube.resume(interaction.guild)
                interaction.reply({ embeds: [embedmsg.resume()] }).catch((err) => {
                    console.error(err);
                })
            }).catch((err) => {
                console.error(err);
                let embedmsg = new ErrEmbed(interaction.guild, interaction.member);
                embedmsg.init().then(() => {
                    interaction.reply({ embeds: [embedmsg.notresumeError()], ephemeral: true }).catch((err) => {
                        console.error(err);
                    });
                }).catch((err) => {
                    console.error(err);
                });
            });


    }

}