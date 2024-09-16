const { helppagebuilder } = require("../../../function/interaction/button/helpmenubuilder");
module.exports = {
    name: "help",
    permisions: [],
    allowedchannels: true,
    allowebot: true,
    OnlyOwner: false,
    position: false,
    test: false,
    see: false,
    data: {
        name: "help",
        description: "/help"
    },
    execute(interaction) {

        let help = new helppagebuilder()

        help.mainpage(interaction).then((menu) => {
            interaction.reply({ embeds: menu[0], components: menu[1] });
        }).catch((err) => {
            console.log(err);
        });

    }
}