const { helppagebuilder } = require("../../function/interaction/button/helppagebuilder");

module.exports = {
    name: "help",
    description: "Gestisce i bottoni di help",
    execute(interaction, interactioncustomId) {
        let help = new helppagebuilder()

        if (interactioncustomId[2] === "0") {
            help.mainpage(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] });
            }).catch((err) => {
                console.log(err);
            })
        } else if (interactioncustomId[2] === "1") {
            let command = client.commandg.get(interaction.values[0])
            help.commandpage(interaction, command, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] });
            }).catch((err) => {
                console.log(err);
            })
        }

    }
}
