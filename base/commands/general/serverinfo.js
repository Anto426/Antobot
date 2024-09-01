const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "avatar",
    permisions: [],
    allowedchannels: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "userinfo",
        description: "ritorna le informazioni del server"
    },
    execute(interaction) {


        let embed = new comandbembed(interaction.guild, interaction.member)

        embed.init().then(() => {
            interaction.reply({
                embeds: [embed.serverinfo(interaction.guild)],
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