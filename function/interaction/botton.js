const { ErrEmbed } = require("../../embed/err/errEmbed");
const { Check } = require("../check/check");

class botton {
    constructor() {
        this.check = new Check()
    }

    checkIsYourButton(interaction) {
        return new Promise((resolve, reject) => {
            this.check.checkIsYou(interaction.customId.toString().split("-")[1], interaction.member.id).then(() => {
                resolve(0)
            }).catch(() => {
                let embed = new ErrEmbed(interaction.guild, interaction.member)
                embed.init().then(() => {
                    interaction.reply({ embeds: [embed.errYourBotton()], ephemeral: true })
                })
                reject(-1)
            })
        })

    }
}

module.exports = { botton }