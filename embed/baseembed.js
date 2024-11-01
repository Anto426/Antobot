const { EmbedBuilder } = require("discord.js")
const { DynamicColor } = require("../function/Color/DynamicColor")

class BaseEmbed {
    constructor(guild, member, image = client.user.displayAvatarURL() ) {
        this.guild = guild
        this.member = member
        this.embed = new EmbedBuilder()
        this.color = new DynamicColor()
        this.image = image
    }
    init() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.guild) {
                    this.owner = await this.guild.fetchOwner()
                    this.embed
                        .setTimestamp()
                        .setAuthor({
                            name: this.owner.user.username,
                            iconURL: this.owner.user.displayAvatarURL({
                                dynamic: true,
                                format: "png",
                                size: 512
                            })

                        })
                }

                if (this.member)
                    this.embed.setFooter({
                        text: "📢 Richiesta effetuata da " + this.member.user.username,
                        iconURL: this.member.user.displayAvatarURL({
                            dynamic: true,
                            format: "png",
                            size: 512
                        })
                    });

                await this.color.setImgUrl(this.image)
                this.color.setThreshold(50)
                this.color.setNumcolorextract(2)
                await this.color.ExtractPalet().then((palette) => {
                    let color = palette[0]
                    this.embed.setColor(this.color.ColorFunctions.rgbToHex(color[0], color[1], color[2]))
                }).catch((err) => { console.log(err) })

                resolve(this.embed)
            } catch (err) {
                console.log(err)
                reject(-1)
            }
        })
    }
}

module.exports = { BaseEmbed }