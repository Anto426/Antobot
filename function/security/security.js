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
            if (!this.owner || !this.serverOwner) {
                if (this.command.allowedChannels) {
                    super.checkChannel(this.interaction.channel.id, arr)
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
            } else {
                resolve(0);
                this.channel = true;
            }
        });
    }

    checkPermission() {
        return new Promise((resolve) => {
            if (!this.owner || !this.serverOwner) {
                if (this.command.permisions.size > 0) {
                    super.checkPermission(this.interaction.member.id, this.interaction.guild.id, this.command.permission)
                        .then(() => {
                            this.staff = true;
                            resolve(0);
                        })
                        .catch(() => {
                            resolve(0);
                        });
                } else {
                    resolve(0);
                    this.staff = true;
                }
            } else {
                this.staff = true;
                resolve(0);
            }
        });
    }

    checkPosition() {
        return new Promise((resolve) => {

            if (this.command.position && this.interaction.options.getUser("user")) {
                super.checkPosition(this.interaction.member.id, this.interaction.options.getUser("user").id, this.interaction.guild.id)
                    .then(() => {
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
            if (this.command.position && this.interaction.options.getUser("user")) {
                super.checkIsYou(this.interaction.member.id, this.interaction.options.getUser("user").id).then(() => {
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
            if (this.interaction.options.getUser("user") && !this.command.allowebot) {
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
                        result = 4;
                    } else {
                        if (result[1] && result[0].id != result[1].id) {
                            result = 5;
                        }
                    }
                }
                if (this.command.disTube.checklisttrack) {
                    if (!distube.getQueue(this.interaction)) {
                        result = 6;
                    }
                }
                if (Array.isArray(result)) {
                    resolve(result);
                } else {
                    reject(result);
                }

            } catch (err) {
                console.log(err);
                reject(0);
            }
        });
    }

    allowCommand() {
        console.log("owner", this.owner, "serverOwner", this.serverOwner, "staff", this.staff, "isBot", this.isBot, "isYou", this.isYou, "position", this.position, "channel", this.channel);
        return new Promise(async (resolve, reject) => {
            if (this.owner) {
                if (!this.isYou) {
                    if (!this.isBot) {
                        if (this.command.type == "Distube") {
                            this.checkDistube().then((result) => {
                                resolve(result);
                            }).catch((err) => {
                                reject(err);
                            });
                        } else {
                            resolve(0);
                        }
                    } else {
                        reject(1);
                    }
                } else {
                    reject(2);
                }
            } else {
                if (this.command.onlyOwner) {
                    reject(0);
                }
                if (this.serverOwner) {
                    if (!this.isYou) {
                        if (!this.isBot) {
                            if (this.command.type == "Distube") {
                                this.checkDistube().then((result) => {
                                    resolve(result);
                                }).catch((err) => {
                                    reject(err);
                                });
                            } else {
                                resolve(0);
                            }
                        } else {
                            reject(1);
                        }
                    }
                    else {
                        reject(2);
                    }
                } else {
                    if (this.staff) {
                        if (this.position) {
                            if (!this.isBot) {
                                if (!this.isYou) {
                                    if (this.channel) {
                                        if (this.command.type == "Distube") {
                                            this.checkDistube().then((result) => {
                                                resolve(result);
                                            }).catch((err) => {
                                                reject(err);
                                            });
                                        } else {
                                            resolve(0);
                                        }
                                    } else {
                                        reject(0);
                                    }
                                } else {
                                    reject(2);
                                }
                            } else {
                                reject(1);
                            }
                        } else {
                            reject(3);
                        }
                    } else {
                        reject(0);
                    }
                }
            }
        });
    }
}

module.exports = {
    Security
};