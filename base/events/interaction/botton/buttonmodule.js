const { ErrEmbed } = require("../../../../embed/err/errembed");
const { Check } = require("../../../../function/check/check");

module.exports = {
    name: "buttonmodule",
    typeEvent: "interactionCreate",
    allowevents: true,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) return;
        let check = new Check()
        let interactioncustomId = interaction.customId.toString().split("-")

        check.checkIsYou(interactioncustomId[1], interaction.member.id).then(() => {

            if (client.buttong.size > 0) {

                let interactionbutton = client.basebutton.get(interactioncustomId[0])

                if (interactionbutton) {
                    try {
                        interactionbutton.execute(interaction, interactioncustomId)
                    } catch (err) {
                        console.log(err)
                        let embed = new ErrEmbed(interaction.guild, interaction.member)
                        embed.init().then(() => {
                            interaction.reply({ embeds: [embed.genericError()], ephemeral: true })
                        })
                    }
                } else {
                    let embed = new ErrEmbed(interaction.guild, interaction.member)
                    embed.init().then(() => {
                        interaction.reply({ embeds: [embed.buttonnotvalidError()], ephemeral: true })
                    })
                }

            } else {

                let embed = new ErrEmbed(interaction.guild, interaction.member)
                embed.init().then(() => {
                    interaction.reply({ embeds: [embed.buttonnotvalidError()], ephemeral: true })
                })

            }

        }).catch((err) => {
            console.log(err)
            let embed = new ErrEmbed(interaction.guild, interaction.member)
            embed.init().then(() => {
                interaction.reply({ embeds: [embed.wrongButtonError()], ephemeral: true })
            })
            reject(-1)
        })




    }
}


