const { unbanpagebuilder } = require("../../function/interaction/button/unbanmenubuilder");

module.exports = {
    name: "unban",
    description: "Gestisce i bottoni di unban",
    execute(interaction, interactioncustomId) {
        let unbanbuilder = new unbanpagebuilder()

        if (interactioncustomId[2] === "0") {
            unbanbuilder.mainpage(interaction).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] });
            }).catch((err) => {
                console.log(err);
            })
        } else if (interactioncustomId[2] === "1") {
            unbanbuilder.userpage(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] });
            }).catch((err) => {
                console.log(err);
            })
        } else if (interactioncustomId[2] === "2") {
            unbanbuilder.unbanconfirmedpage(interaction, interactioncustomId).then((menu) => {
                interaction.update({ embeds: menu[0], components: menu[1] });
            }).catch((err) => {
                console.log(err);
            })
        }

    }
}
