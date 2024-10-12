const { PermissionsBitField } = require("discord.js");
const { unbanpagebuilder } = require("../../../function/interaction/button/unbanpagebuilder");
module.exports = {
    name: "unban",
    permisions: [PermissionsBitField.Flags.BanMembers],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: true,
    test: false,
    see: true,
    data: {
        name: "unban",
        description: "unban un utente"
    },
    execute(interaction) {

        let unbanbuilder = new unbanpagebuilder()

        unbanbuilder.mainpage(interaction).then((menu) => {
            interaction.reply({ embeds: menu[0], components: menu[1] }).catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.log(err);
        });

    }
}