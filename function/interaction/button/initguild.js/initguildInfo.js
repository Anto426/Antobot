const { ChannelType, PermissionFlagsBits } = require("discord.js");
const { Cjson } = require("../../../file/json");
const { BotConsole } = require("../../../log/botConsole");

class InitguildInfo {

    constructor() {
        this.Cjson = new Cjson();
        this.botConsole = new BotConsole();
    }


    async reset(guild, root) {
        return new Promise((resolve, reject) => {
            this.Cjson.readJson(root).then((data) => {
                if (!data[guild.id]) {
                    this.botConsole.log("Errore: Dati non trovati", "red")
                    reject(-1)
                } else {
                    try {
                        if (data[guild.id].channel.tempchannel) {
                            let tempchannel = data[guild.id].channel.tempchannel
                            for (let i in tempchannel) {
                                console.log(i)
                                if (i != "id")
                                    guild.channels.cache.get(tempchannel[i].id).delete().catch((err) => { console.log(err) })
                                else
                                    guild.channels.cache.get(tempchannel[i]).delete().catch((err) => { console.log(err) })
                            }
                        }
                        if (data[guild.id].channel.hollyday) {
                            let hollyday = data[guild.id].channel.hollyday
                            for (let i in hollyday) {
                                if (i != "send")
                                    guild.channels.cache.get(hollyday[i]).delete().catch((err) => { console.log(err) })
                            }
                        }
                    } catch (err) {
                        console.log(err)
                    }

                    delete data[guild.id]

                    this.Cjson.createJSONFile(root, data).then(() => {
                        this.botConsole.log("Reset completato", "green")
                        resolve(0)
                    }).catch(() => {
                        this.botConsole.log("Errore: Reset non completato", "red")
                        reject(-1)
                    })
                }

            }).catch(() => {
                reject(-1)
            })
        })
    }


    async DisableTempChannel(guild, root) {
        return new Promise((resolve, reject) => {
            this.Cjson.readJson(root).then((data) => {
                if (data[guild.id]) {
                    if (data[guild.id].channel.tempchannel) {
                        let tempchannel = data[guild.id].channel.tempchannel
                        for (let i in tempchannel) {
                            if (i != "id")
                                guild.channels.cache.get(tempchannel[i].id).delete().catch((err) => { console.log(err) })
                            else
                                guild.channels.cache.get(tempchannel[i]).delete().catch((err) => { console.log(err) })
                        }
                        delete data[guild.id].channel.tempchannel
                        this.Cjson.createJSONFile(root, data).then(() => {
                            resolve(0)
                        }).catch(() => { reject(-1) })
                    } else {
                        this.botConsole.log("Errore: Canali non trovati", "red")
                        reject(-1)
                    }
                } else {
                    this.botConsole.log("Errore: Dati non trovati", "red")
                    reject(-1)
                }

            }).catch(() => { reject(-1) })
        })
    }


    async DisableHollydayModule(guild, root) {
        return new Promise((resolve, reject) => {
            this.Cjson.readJson(root).then((data) => {
                if (data[guild.id]) {
                    if (data[guild.id].channel.hollyday) {
                        let hollyday = data[guild.id].channel.hollyday
                        for (let i in hollyday) {
                            if (i != "send")
                                guild.channels.cache.get(hollyday[i]).delete().catch((err) => { console.log(err) })
                        }
                        delete data[guild.id].channel.hollyday
                        this.Cjson.createJSONFile(root, data).then(() => {
                            resolve(0)
                        }).catch(() => { reject(-1) })
                    }
                }
            }).catch(() => { reject(-1) })
        })
    }


    async SavedRole(root, newdata, idguild, key) {
        return new Promise((resolve, reject) => {
            if (root) {
                this.Cjson.readJson(root).then((data) => {
                    if (data[idguild]) {
                        if (data[idguild].role) {
                            data[idguild].role[key] = newdata
                        } else {
                            data[idguild].role = { [key]: newdata }
                        }
                        this.Cjson.createJSONFile(root, data).then(() => {
                            this.botConsole.log("Ruoli salvati", "green")
                            resolve(0)
                        }).catch(() => { reject(-1) })

                    } else {
                        reject(-1)
                    }
                }).catch(() => { })
            }
        })
    }



    async SavedAllowChannel(root, newdata, idguild) {
        return new Promise((resolve, reject) => {
            if (root) {
                this.Cjson.readJson(root).then((data) => {
                    if (data[idguild]) {
                        if (data[idguild].channel) {
                            newdata.forEach((element) => {
                                if (!data[idguild].channel.allowchannel.includes(element)) {
                                    data[idguild].channel.allowchannel.push(element)
                                }
                            });
                        } else {
                            data[idguild].channel = {
                                allowchannel: newdata
                            }
                        }
                    } else {
                        data[idguild] = {
                            channel: {
                                allowchannel: newdata
                            }
                        }
                        data[idguild].channel.allowchannel = newdata
                    }

                    this.Cjson.createJSONFile(root, data).then(() => {
                        this.botConsole.log("Canali salvati", "green")
                        resolve(0)
                    }).catch(() => { reject(-1) })

                }).catch(() => {
                    let data = {
                        [idguild]: {
                            channel: {
                                allowchannel: newdata
                            }
                        }
                    }
                    this.Cjson.createJSONFile(root, data).then(() => {
                        this.botConsole.log("Canali salvati", "green")
                        resolve(0)
                    }).catch(() => { reject(-1) })
                })
            } else {
                this.botConsole.log("Errore: Root non trovata", "red")

                reject(-1)
            }
        })

    }


    async enableHollydayModule(guild, root) {
        return new Promise((resolve, reject) => {
            this.Cjson.readJson(root).then(async (data) => {
                if (guild) {
                    if (data[guild.id]) {
                        if (!data[guild.id].channel.hollyday) {


                            let parent = await guild.channels.create(
                                {
                                    name: 'hollyday',
                                    type: ChannelType.GuildCategory
                                }
                            )
                            let channelname = await guild.channels.create(
                                {
                                    name: 'name',
                                    type: ChannelType.GuildVoice,
                                    parent: parent,
                                    permissionOverwrites: [
                                        {
                                            id: guild.roles.everyone,
                                            parent: parent,
                                            deny: [PermissionFlagsBits.Connect]
                                        }
                                    ]
                                }
                            )
                            let channeldate = await guild.channels.create(
                                {
                                    name: "00d:00h:00m:00s",
                                    type: ChannelType.GuildVoice,
                                    parent: parent,
                                    permissionOverwrites: [
                                        {
                                            id: guild.roles.everyone,
                                            parent: parent,
                                            deny: [PermissionFlagsBits.Connect]
                                        }
                                    ]
                                }
                            )
                            if (data[guild.id]) {
                                if (data[guild.id].channel) {
                                    let newdata = {
                                        "id": parent.id,
                                        "name": channelname.id,
                                        "date": channeldate.id,
                                        "send": data[guild.id].channel.events
                                    }

                                    data[guild.id].channel.hollyday = newdata
                                    this.Cjson.createJSONFile(root, data).then(() => {
                                        this.botConsole.log("Modulo abilitato", "green")
                                        resolve(0)
                                    }).catch(() => {
                                        reject(-1)
                                    })
                                } else {
                                    this.botConsole.log("Errore: Canali non trovati", "red")
                                    reject(-1)
                                }
                            }
                        } else {
                            this.botConsole.log("Errore: Canali già presenti", "red")
                            reject(-1)
                        }
                    } else {
                        this.botConsole.log("Errore: Dati non trovati", "red")
                        reject(-1)
                    }
                } else {
                    this.botConsole.log("Errore: Guild non trovata", "red")
                    reject(-1)
                }

            }).catch((err) => {
                console.log(err)
                reject(-1)
            })



        })


    }


    async singleChannel(channel, root, key) {

        return new Promise((resolve, reject) => {
            if (channel) {

                this.Cjson.readJson(root).then((data) => {
                    if (data[channel.guild.id]) {
                        if (data[channel.guild.id].channel) {
                            data[channel.guild.id].channel[key] = channel.id
                            this.Cjson.createJSONFile(root, data).then(() => {
                                resolve(0)
                            }).catch(() => {
                                reject(-1)
                            })
                        } else {
                            this.botConsole.log("Errore: Canale non trovato", "red")
                            reject(-1)
                        }

                    }
                }).catch((err) => {
                    console.log(err)
                })

            }

        })

    }


    async enableTempChannel(guild, root) {
        return new Promise((resolve, reject) => {


            if (guild) {
                this.Cjson.readJson(root).then(async (data) => {

                    if (data[guild.id]) {
                        if (data[guild.id].channel) {
                            if (!data[guild.id].channel.tempchannel) {

                                let parent = await guild.channels.create(
                                    {
                                        name: "TempChannel",
                                        type: ChannelType.GuildCategory
                                    }
                                )

                                let newdata = {
                                    "id": parent.id,
                                    "Doble": {
                                        "id": NaN,
                                        "limit": 2
                                    },
                                    "Trio": {
                                        "id": NaN,
                                        "limit": 3
                                    },
                                    "Squad": {
                                        "id": NaN,
                                        "limit": 4
                                    },
                                    "noLimit": {
                                        "id": NaN,
                                        "limit": 0
                                    }
                                }
                                for (let i in newdata) {
                                    if (i != "id") {
                                        let channel = await guild.channels.create({
                                            name: i,
                                            type: ChannelType.GuildVoice,
                                            parent: parent
                                        })

                                        console.log(channel.id)

                                        newdata[i].id = channel.id

                                    }

                                }
                                if (data[guild.id]) {
                                    if (data[guild.id].channel) {
                                        data[guild.id].channel.tempchannel = newdata
                                        this.Cjson.createJSONFile(root, data).then(() => {
                                            this.botConsole.log("Modulo abilitato", "green")
                                            resolve(0)
                                        }).catch(() => {
                                            reject(-1)
                                        })
                                    } else {
                                        this.botConsole.log("Errore: Canali non trovati", "red")
                                        reject(-1)
                                    }

                                }
                            } else {
                                this.botConsole.log("Errore: Canali già presenti", "red")
                                reject(-1)
                            }
                        } else {
                            this.botConsole.log("Errore: Dati non trovati", "red")
                            reject(-1)
                        }
                    } else {
                        this.botConsole.log("Errore: Dati non trovati", "red")
                        reject(-1)
                    }
                }).catch((err) => {
                    console.log(err)
                    reject(-1)
                })

            } else {
                this.botConsole.log("Errore: Guild non trovata", "red")
                reject(- 1)
            }
        })
    }

}



module.exports = {
    InitguildInfo
}