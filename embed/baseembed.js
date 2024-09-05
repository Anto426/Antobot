const { EmbedBuilder } = require("discord.js")

class BaseEmbed {
    constructor(guild, member) {
        this.guild = guild
        this.member = member
        this.embed = new EmbedBuilder()
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

                resolve(this.embed)
            } catch (err) {
                console.log(err)
                reject(-1)
            }
        })
    }
}

module.exports = { BaseEmbed }