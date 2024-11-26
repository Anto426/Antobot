const { ErrEmbed } = require("../../../../embed/err/errembed");

module.exports = {
    name: "buttonmodule",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {
        return new Promise((resolve, reject) => {
            if (interaction.isChatInputCommand()) return;
            let interactioncustomId = interaction.customId.toString().split("-")

            if (interactioncustomId[1] === interaction.member.id) {

                if (client.buttong.size > 0 && interactioncustomId.length > 3) {

                    let interactionbutton = client.basebutton.get(interactioncustomId[0])

                    if (interactionbutton) {
                        interactionbutton.execute(interaction, interactioncustomId).catch((err) => {
                            reject(interaction, err)
                        })

                    } else {
                        reject(interaction, errorIndex.REPLY_ERRORS.BUTTON_NOT_VALID_ERROR)
                    }

                } else {
                    reject(interaction, errorIndex.REPLY_ERRORS.BUTTON_NOT_VALID_ERROR)
                }

            } else {
                console.log(err)
                reject(interaction, errorIndex.REPLY_ERRORS.WRONG_BUTTON_ERROR)
            }

            resolve(0);
        })


    }
}


