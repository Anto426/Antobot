const fs = require("fs")
const { Collection } = require("discord.js");
const setting = require("./../../setting/settings.json");
const { collectioncrete } = require("../dir/dirfunction");
const { consolelog } = require("../log/consolelog");


class loadeventsandcommand {
    constructor() { }

    load(namecollect, dir) {

        return new Promise(async (resolve, reject) => {
            try {

                client[namecollect] = new Collection()
                try {
                    let commandF = fs.readdirSync(dir)
                    if (commandF.length != 0) {
                        await collectioncrete(client[namecollect], dir, commandF, "js")
                        if (client[namecollect].size == 0) {
                            reject(-1)
                        }
                        else {
                            resolve(0)
                        }
                    }
                    else {
                        consolelog("Non ci sono " + namecollect + "da caricare ", "red")
                        resolve(0)
                    }
                } catch (err) {
                    console.log(err)
                    consolelog("Errore non ho trovato la cartella:" + dir, "red")
                    reject(-1)
                }


            } catch (err) { reject(-1) }
        })
    }

    loadcommand() {

        this.load("commands", setting.base.commands)
            .then(() => {
            })
            .catch(() => { consolelog("Errore non ho caricato i camandi", "red") })
    }

    loadevents() {
        this.load("events", setting.base.events)
            .then(() => {
                client.events.forEach(x => {
                    client.on(x.name, (...args) => {
                        x.execute(...args)
                    });
                });
            })
            .catch((err) => {
                consolelog(err)
                consolelog("Errore non ho caricato gli eventi", "red")
                client.events.delete();
            })

    }

    loadall() {
        return new Promise(async (resolve, reject) => {
            try {
                this.loadcommand()
                this.loadevents()
                resolve(0)
            } catch {
                reject(-1)
            }

        })

    }


}



module.exports = {
    loadeventsandcommand
}