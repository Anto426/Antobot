const { ChannelType } = require("discord.js")
const { check } = require("../check/check")
class securyty extends check {

    constructor(interaction, command) {
        super()
        this.owner = false
        this.Sowner = false
        this.staff = false
        this.position = false
        this.channel = false
        this.isbot = false
        this.isyou = false
        this.command = command
        this.interaction = interaction
        this.voiceChannel = interaction.member.voice.channel
        this.voiceChannelBot = interaction.guild.channels.cache.find(x => x.type == ChannelType.GuildVoice && x.members.has(client.user.id))
    }



    chekowner(arr) {
        return new Promise((resolve) => {
            console.log(arr)
            super.chekowner(arr, this.interaction.member.id)
                .then(() => {
                    this.owner = true;
                    resolve(0)
                })
                .catch(() => {
                    resolve(0)

                })
        })
    }



    checksowner() {

        return new Promise((resolve) => {
            super.checksowner(this.interaction.member.id, this.interaction.guild.id)
                .then(() => {
                    this.Sowner = true;
                    resolve(0)
                })
                .catch(() => {
                    resolve(0)
                })
        })


    }
    checkpchannel(arr) {

        return new Promise((resolve) => {
            if (!this.owner || !this.Sowner) {
                if (this.command.allowedchannels)
                    super.checkpchannel(this.interaction.channel.id, arr)
                        .then(() => {
                            this.channel = true;
                            resolve(0)
                        })
                        .catch(() => {
                            resolve(0)
                        })
                else {
                    resolve(0)
                    this.channel = true
                }
            } else {
                resolve(0)
                this.channel = true
            }


        })

    }

    checkpermision() {

        return new Promise((resolve) => {
            if (!this.owner || !this.Sowner) {
                if (this.command.permisions.size > 0)
                    super.checkpermision(this.interaction.member.id, this.interaction.guild.id, this.command.permision)
                        .then(() => {
                            this.staff = true;
                            resolve(0)
                        })
                        .catch(() => {
                            resolve(0)
                        })
                else {
                    resolve(0)
                    this.staff = true
                }
            }
            else {
                this.staff = true
                resolve(0)
            }
        })

    }

    checkposition() {

        return new Promise((resolve) => {
            if (this.command.position && interaction.options.getUser("user"))
                super.checkposition(this.interaction.member.id, interaction.options.getUser("user").id, this.interaction.gild.id)
                    .then(() => {
                        resolve(0)

                    })
                    .catch(() => {
                        resolve(0)
                    })
            else {
                this.position = true;
                resolve(0)
            }
        })

    }

    checkisyou() {

        return new Promise((resolve) => {
            if (this.command.position && interaction.options.getUser("user"))
                super.checkisyou(this.interaction.member.id, interaction.options.getUser("user").id).then(() => {
                    this.isyou = true
                    resolve(0)
                }).catch(() => {
                    resolve(0)
                })
            else
                resolve(0)
        })

    }

    chekisbot() {

        return new Promise((resolve) => {
            if (this.interaction.options.getUser("user"))
                super.chekisbot(this.interaction.member.id, this.interaction.guild.id).then(() => {
                    this.isbot = true
                    resolve(0)
                }).catch(() => {
                    resolve(0)
                })
            else
                resolve(0)
        })

    }

    allowcomand() {
        console.log(this.owner, this.Sowner, this.staff, this.isbot, this.isyou, this.position, this.channel)
        return new Promise(async (resolve, reject) => {
            if (this.owner)
                resolve(0)
            else {
                if (this.command.OnlyOwner) reject(0)
                if (this.Sowner) resolve(0)
                else {
                    if (this.staff) {
                        if (this.position) {
                            if (!this.isbot) {
                                if (!this.isyou) {
                                    if (this.channel) {
                                        if (this.command.type == "Distube") {
                                            if (!this.voiceChannel) {
                                                reject(4)
                                            } else {
                                                if (this.voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
                                                    reject(5)
                                                } else resolve(0)
                                            }
                                        } else resolve(0)
                                    } else reject(0)
                                } else reject(2)
                            } else reject(1)
                        } else reject(3)
                    } else reject(0)
                }
            }



        })

    }
}
module.exports = {
    securyty
}