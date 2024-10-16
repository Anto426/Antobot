const { comandbembed } = require("../../../embed/base/command");
const { ErrEmbed } = require("../../../embed/err/errembed");
module.exports = {
    name: "botinfo",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: true,
    data: {
        name: "botinfo",
        description: "ritorna le informazioni del bot"
    },
    execute(interaction) {

        let embed = new comandbembed(interaction.guild, interaction.member)

        embed.init().then(() => {
            interaction.reply({
                embeds: [embed.botinfo(client.user)],
            }).catch((err) => { console.log(err) });
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