const { CommandEmbed } = require("../../embed/distube/command");
const { ErrEmbed } = require("../../embed/err/errembed");

module.exports = {
    name: "resume",
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
        name: "resume",
        description: "riprende la canzone",
    },
    async execute(interaction) {


        let embedmsg = new CommandEmbed(interaction.guild, interaction.member)

        embedmsg.init()
            .then(async () => {
                distube.resume(interaction.guild).then(() => {
                    interaction.reply({ embeds: [embedmsg.resume()] })
                }).catch(() => {
                    let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
                    embedmsg.init().then(() => {
                        interaction.reply({ embeds: [embedmsg.notresumeError()], ephemeral: true })
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