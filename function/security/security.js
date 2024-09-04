const { ChannelType } = require("discord.js");
const { Check } = require("../check/check");

class Security extends Check {
    constructor(interaction, command) {
        super();
        this.owner = false;
        this.serverOwner = false;
        this.staff = false;
        this.position = false;
        this.channel = false;
        this.isBot = false;
        this.isYou = false;
        this.command = command;
        this.interaction = interaction;
        this.codeErr = {
            genericError: 0,
            ownerError: 1,
            notPermissionError: 2,
            botUserError: 3,
            selfUserError: 4,
            highPermissionError: 5,
            notInVoiceChannelError: 6,
            musicAlreadyPlayingError: 7,
            listtrackError: 8
        }
    }

    checkOwner(arr) {
        return new Promise((resolve) => {
            super.checkOwner(arr, this.interaction.member.id)
                .then(() => {
                    this.owner = true;
                    resolve(0);
                })
                .catch(() => {
                    resolve(0);
                });
        });
    }

    checkServerOwner() {
        return new Promise((resolve) => {
            super.checkSOwner(this.interaction.member.id, this.interaction.guild.id)
                .then(() => {
                    this.serverOwner = true;
                    resolve(0);
                })
                .catch(() => {
                    resolve(0);
                });
        });
    }

    checkChannel(arr) {
        return new Promise((resolve) => {
            if (this.command.allowedChannels) {
                super.checkPChannel(this.interaction.channel.id, arr)
                    .then(() => {
                        this.channel = true;
                        resolve(0);
                    })
                    .catch(() => {
                        resolve(0);
                    });
            } else {
                resolve(0);
                this.channel = true;
            }
        });
    }

    checkPermission() {
        return new Promise((resolve) => {
            super.checkPermission(this.interaction.member, this.command.permisions)
                .then(() => {
                    this.staff = true;
                    resolve(0);
                })
                .catch(() => {
                    resolve(0);
                });
        });
    }

    checkPosition() {
        return new Promise((resolve) => {
            let otherUser = this.interaction.options.getMember("user")
            if (this.command.position && otherUser) {
                super.checkPosition(this.interaction.member, otherUser)
                    .then(() => {
                        this.position = true;
                        resolve(0);
                    })
                    .catch(() => {
                        resolve(0);
                    });
            } else {
                this.position = true;
                resolve(0);
            }
        });
    }

    checkIsYou() {
        return new Promise((resolve) => {
            let otherUser = this.interaction.options.getMember("user")
            if (this.command.position && otherUser) {
                super.checkIsYou(this.interaction.member.id, otherUser.id).then(() => {
                    this.isYou = true;
                    resolve(0);
                }).catch(() => {
                    resolve(0);
                });
            } else {
                resolve(0);
            }
        });
    }

    checkIsBot() {
        return new Promise((resolve) => {
            let otherUser = this.interaction.options.getMember("user")
            if (otherUser && !this.command.allowebot) {
                super.checkIsBot(this.interaction.options.getUser("user")).then(() => {
                    this.isBot = true;
                    resolve(0);
                }).catch(() => {
                    resolve(0);
                });
            } else {
                resolve(0);
            }
        });
    }

    checkDistube() {
        return new Promise((resolve, reject) => {
            try {

                let result = [this.interaction.member.voice.channel, this.interaction.guild.channels.cache.find(x => x.type == ChannelType.GuildVoice && x.members.has(client.user.id))];

                if (this.command.disTube.checkchannel) {
                    if (!result[0]) {
                        result = this.codeErr.notInVoiceChannelError;
                    } else {
                        if (result[1] && result[0].id != result[1].id) {
                            result = this.codeErr.musicAlreadyPlayingError;
                        }
                    }
                }
                if (this.command.disTube.checklisttrack) {
                    if (!distube.getQueue(this.interaction)) {
                        result = this.codeErr.listtrackError;
                    }
                }
                if (Array.isArray(result)) {
                    resolve(result);
                } else {
                    reject(result);
                }

            } catch (err) {
                console.log(err);
                reject(this.codeErr.genericError);
            }
        });
    }

    allowCommand() {
        console.log("owner", this.owner, "serverOwner", this.serverOwner, "staff", this.staff, "isBot", this.isBot, "isYou", this.isYou, "position", this.position, "channel", this.channel);
        return new Promise(async (resolve, reject) => {

            if (this.command.OnlyOwner) {
                if (this.owner) {
                    if (!this.isYou) {
                        if (!this.isBot) {
                            if (this.command.type == "Distube") {
                                this.checkDistube()
                                    .then((result) => {
                                        resolve(result);
                                    }).catch((err) => {
                                        reject(err);
                                    });
                            } else {
                                resolve(0);
                            }
                        } else {
                            reject(this.codeErr.botUserError);
                        }
                    } else {
                        reject(this.codeErr.selfUserError);
                    }
                } else {
                    reject(this.codeErr.ownerError);
                }
            } else {
                if (this.serverOwner && this.owner) {
                    if (!this.isYou) {
                        if (!this.isBot) {
                            if (this.command.type == "Distube") {
                                this.checkDistube()
                                    .then((result) => {
                                        resolve(result);
                                    }).catch((err) => {
                                        reject(err);
                                    });
                            } else {
                                resolve(0);
                            }
                        } else {
                            reject(this.codeErr.botUserError);
                        }
                    } else {
                        reject(this.codeErr.selfUserError);
                    }
                } else {
                    if (this.staff) {
                        if (this.position) {
                            if (!this.isBot) {
                                if (!this.isYou) {
                                    if (this.channel) {
                                        if (this.command.type == "Distube") {
                                            this.checkDistube()
                                                .then((result) => {
                                                    resolve(result);
                                                }).catch((err) => {
                                                    reject(err);
                                                });
                                        } else {
                                            resolve(0);
                                        }
                                    } else {
                                        reject(this.codeErr.notPermissionError);
                                    }
                                } else {
                                    reject(this.codeErr.selfUserError);
                                }
                            } else {
                                reject(this.codeErr.botUserError);
                            }
                        } else {
                            reject(this.codeErr.highPermissionError);
                        }
                    } else {
                        reject(this.codeErr.notPermissionError);
                    }

                }
            }

        });
    }
}

module.exports = {
    Security
};