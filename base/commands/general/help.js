const { helppagebuilder } = require("../../../function/interaction/button/helppagebuilder");
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

        let helpbuilder = new helppagebuilder()

        helpbuilder.mainpage(interaction).then((menu) => {
            interaction.reply({ embeds: menu[0], components: menu[1] });
        }).catch((err) => {
            console.log(err);
        });

    }
}