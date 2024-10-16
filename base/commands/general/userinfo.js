const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "userinfo",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "userinfo",
        description: "ritorna le informazioni del server",
        options: [{
            name: "user",
            description: "l'utente di cui vuoi le informazioni",
            type: 6,
            required: false
        }]
    },
    execute(interaction) {


        let embed = new comandbembed(interaction.guild, interaction.member)
        let member = interaction.options.getMember('user') || interaction.member;


        embed.init().then(() => {
            interaction.reply({
                embeds: [embed.userinfo(member)],
            }).catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.log(err)
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true }).catch((err) => {
                    console.error(err);
                })
            }
            ).catch((err) => {
                console.error(err);
            })
        })

    }
}