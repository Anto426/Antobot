const { errembed } = require("../../../embed/err/errembed")

module.exports = {
    name: "testembed",
    permisions: [],
    allowedchannels: [],
    OnlyOwner: false,
    position: false,
    test: false,
    data: {
        name: "testembed",
        description: "Testa gli embed"
    },
    execute(interaction) {
        try {
            let embed = new errembed(interaction.guild, interaction.member)
            embed.init().then(() => {
                interaction.reply({ embeds: [embed.errAreYou()] })
            }).catch((err) => { console.log(err) })
        } catch (err) {
            console.log(err)
        }

    }
}