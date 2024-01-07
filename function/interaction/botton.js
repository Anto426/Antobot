const { errembed } = require("../../embed/err/errembed");
const { check } = require("../check/check");

class botton {
    constructor() {
        this.check = new check()
    }

    checkisyourbotton(interaction) {
        return new Promise((resolve, reject) => {
            this.check.checkisyou(interaction.customId.toString()[2], interaction.member.id).then(() => {
                resolve(0)
            }).catch(() => {
                let embed = new errembed(interaction.guild, interaction.member)
                embed.init().then(() => {
                    interaction.reply({ embeds: [embed.errYourBotton()], ephemeral: true })
                })
                reject(-1)
            })
        })

    }
}

module.exports = { botton }