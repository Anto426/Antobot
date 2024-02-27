 const fs = require("fs")
const { Collection } = require("discord.js");
const setting = require("./../../setting/settings.json");
const { collectioncrete } = require("../dir/dirfunction");
const { consolelog } = require("../log/consolelog");
const { check } = require("../check/check");

class loadeventsandcommand {
    constructor() {
        this.check = new check
    }

    load(namecollect, dir) {

        return new Promise(async (resolve, reject) => {
            try {

                client[namecollect] = new Collection()
                try {
                    let commandF = fs.readdirSync(dir)
                    if (commandF.length != 0) {
                        await collectioncrete(client[namecollect], dir, Array.isArray(commandF) ? commandF : [commandF], "js")
                        if (client[namecollect].size == 0) {
                            reject(-1)
                        }
                        else {
                            resolve(0)
                        }
                    }
                    else {
                        consolelog("Non ci sono " + namecollect + " da caricare ", "red")
                        resolve(0)
                    }
                } catch (err) {
                    (err)
                    consolelog("Errore non ho trovato la cartella:" + dir, "red")
                    reject(-1)
                }


            } catch (err) { reject(-1) }
        })
    }

    loadcommand() {

        this.load("basecommands", process.env.dirbot+ setting.base.commands)
            .then(() => {
            })
            .catch(() => { consolelog("Errore non ho caricato i camandi", "red") })
    }

    loadevents() {
        this.load("baseevents", process.env.dirbot+ setting.base.events)
            .then(() => {


                client.baseevents.forEach(x => {
                    client.on(x.typeEvent, (...args) => {
                        x.execute(...args)
                    });
                });
            })
            .catch((err) => {
                consolelog("Errore non ho caricato gli eventi", "red")
                client.baseevents.delete();
            })

    }

    loaddistubecommand() {

        this.load("distubecommands", process.env.dirbot+ setting.distube.commands)
            .then(() => {
            })
            .catch(() => { consolelog("Errore non ho caricato i camandi", "red") })
    }

    loaddistubeevents() {
        this.load("distubeevents", process.env.dirbot+ setting.distube.events)
            .then(() => {
                client.distubeevents.forEach(x => {
                    distube.on(x.typeEvent, (...args) => {
                        x.execute(...args)
                    });
                });
            })
            .catch((err) => {
                 
                consolelog("Errore non ho caricato gli eventi", "red")
                client.baseevents.delete();
            })

    }
    loadall() {
        return new Promise(async (resolve, reject) => {
            try {
                this.loadcommand()
                this.loadevents()
                this.check.checkallowdistube().then(() => {
                    this.loaddistubecommand()
                    this.loaddistubeevents()
                }).catch(() => { })
                resolve(0)
            } catch {
                resolve(0)
            }

        })

    }


}



module.exports = {
    loadeventsandcommand
}