const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "avatar",
    permisions: [],
    allowedchannels: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: false,
    data: {
        name: "avatar",
        description: "ritorna l'avatar dell'utente"
    },
    execute(interaction) {

        let embed = new comandbembed(interaction.guild, interaction.member)

        embed.init().then(() => {
            interaction.reply({
                embeds: [embed.avatar(interaction.user)],
            });
        }).catch((err) => {
            console.log(err)
            let embedmsg = new ErrEmbed(interaction.guild, interaction.member)
            embedmsg.init().then(() => {
                interaction.reply({ embeds: [embedmsg.genericError()], ephemeral: true })
            }
            ).catch((err) => {
                console.error(err);
            })
        })




    }
}