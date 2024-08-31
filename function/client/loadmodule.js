
const fs = require("fs")
const { Collection } = require("discord.js");
const setting = require("../../setting/settings.json");
const { createCollection } = require("../dir/createCollection");
const { BotConsole } = require("../log/botConsole");
const { Check } = require("../check/check");

class LoadEventsAndCommand {
    constructor() {
        this.check = new Check();
    }

    load(nameCollect, dir) {

        return new Promise(async (resolve, reject) => {
            try {

                client[nameCollect] = new Collection()
                try {
                    let commandFiles = fs.readdirSync(dir)
                    if (commandFiles.length != 0) {
                        await createCollection(client[nameCollect], dir, Array.isArray(commandFiles) ? commandFiles : [commandFiles], "js")
                        setTimeout(() => {
                            if (client[nameCollect].size == 0) {
                                reject(-1)
                            }
                            else {
                                resolve(0)
                            }
                        }, 3000)


                    }
                    else {
                        new BotConsole().log("Non ci sono " + nameCollect + " da caricare ", "red")
                        resolve(0)
                    }
                } catch (err) {
                    console.log(err)
                    new BotConsole().log("Errore non ho trovato la cartella:" + dir, "red")
                    reject(-1)
                }


            } catch (err) { console.log(err); reject(-1) }
        })
    }

    loadcommand() {

        this.load("basecommands", process.env.dirbot + setting.base.commands)
            .then(() => {
                client.basecommands.forEach(x => {
                    x.type = "Base"
                });
            })
            .catch(() => { new BotConsole().log("Errore non ho caricato i camandi:", "red") })
    }

    loadevents() {
        this.load("baseevents", process.env.dirbot + setting.base.events)
            .then(() => {
                client.baseevents.forEach(x => {
                    client.on(x.typeEvent, (...args) => {
                        x.execute(...args)
                    });
                });
            })
            .catch(() => {
                new BotConsole().log("Errore non ho caricato gli eventi", "red")
                client.baseevents.delete();
            })

    }

    loaddistubecommand() {

        this.load("distubecommands", process.env.dirbot + setting.distube.commands)
            .then(() => {
                client.distubecommands.forEach(x => {
                    x.type = "Distube"
                });
            })
            .catch(() => { new BotConsole().log("Errore non ho caricato i camandi", "red") })
    }

    loaddistubeevents() {
        this.load("distubeevents", process.env.dirbot + setting.distube.events)
            .then(() => {
                client.distubeevents.forEach(x => {
                    distube.on(x.typeEvent, (...args) => {
                        x.execute(...args)
                    });
                });
            })
            .catch(() => {

                new BotConsole().log("Errore non ho caricato gli eventi di distube", "red")
                client.distubeevents.delete();
            })

    }
    loadall() {
        return new Promise(async (resolve, reject) => {
            try {
                this.loadevents()
                this.loadcommand()
                this.check.checkAllowDistube().then(() => {
                    this.loaddistubecommand()
                    this.loaddistubeevents()
                }).catch(() => { })

                resolve(0)
            } catch (err) {
                new BotConsole().log(err)
                resolve(0)
            }

        })

    }


}



module.exports = {
    LoadEventsAndCommand
}